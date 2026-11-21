package com.interviewprep.service;

import com.interviewprep.dto.*;
import com.interviewprep.dto.ai.AiQuestionItemDto;
import com.interviewprep.entity.*;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;
    private final EvaluationService evaluationService;

    public InterviewService(
        InterviewRepository interviewRepository,
        InterviewQuestionRepository questionRepository,
        InterviewAnswerRepository answerRepository,
        UserRepository userRepository,
        AiServiceClient aiServiceClient,
        @Lazy EvaluationService evaluationService
    ) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
        this.evaluationService = evaluationService;
    }

    @Transactional
    public InterviewResponse createInterview(Long userId, CreateInterviewRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Interview interview = new Interview(
            user,
            request.getTechnology(),
            request.getDifficulty(),
            request.getInterviewType(),
            request.getNumberOfQuestions()
        );
        Interview savedInterview = interviewRepository.save(interview);

        // Fetch questions from AI Microservice
        List<AiQuestionItemDto> aiQuestions = aiServiceClient.generateQuestions(
            request.getTechnology(),
            request.getDifficulty(),
            request.getInterviewType(),
            request.getNumberOfQuestions()
        );

        List<InterviewQuestion> questionsToSave = new ArrayList<>();
        int order = 1;
        for (AiQuestionItemDto item : aiQuestions) {
            String concepts = item.getExpectedConcepts() != null ? String.join(",", item.getExpectedConcepts()) : "";
            InterviewQuestion q = new InterviewQuestion(
                savedInterview,
                order++,
                item.getQuestionText(),
                item.getTopic(),
                item.getDifficulty(),
                concepts,
                item.getSampleIdealAnswer()
            );
            questionsToSave.add(q);
        }

        List<InterviewQuestion> savedQuestions = questionRepository.saveAll(questionsToSave);
        savedInterview.setQuestions(savedQuestions);

        return InterviewResponse.fromEntity(savedInterview);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to interview session.");
        }

        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
        interview.setQuestions(questions);

        return InterviewResponse.fromEntity(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getUserInterviews(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return interviews.stream().map(InterviewResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void submitAnswer(Long interviewId, Long userId, SubmitAnswerRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview session.");
        }

        InterviewQuestion question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + request.getQuestionId()));

        InterviewAnswer answer = answerRepository.findByInterviewIdAndQuestionId(interviewId, request.getQuestionId())
            .orElse(new InterviewAnswer(interview, question, request.getStudentAnswer()));

        answer.setStudentAnswer(request.getStudentAnswer());
        answerRepository.save(answer);
    }

    @Transactional
    public InterviewResponse completeInterview(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview.");
        }

        interview.setStatus("COMPLETED");
        interview.setCompletedAt(LocalDateTime.now());

        // Perform evaluations for all questions in this interview
        evaluationService.evaluateInterview(interview);

        return InterviewResponse.fromEntity(interview);
    }

    @Transactional
    public void deleteInterview(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this interview.");
        }

        interviewRepository.delete(interview);
    }
}

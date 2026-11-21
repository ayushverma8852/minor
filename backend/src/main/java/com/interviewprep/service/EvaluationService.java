package com.interviewprep.service;

import com.interviewprep.dto.EvaluationResultDto;
import com.interviewprep.dto.QuestionEvaluationDto;
import com.interviewprep.dto.ai.AiEvaluationResponse;
import com.interviewprep.entity.Evaluation;
import com.interviewprep.entity.Interview;
import com.interviewprep.entity.InterviewAnswer;
import com.interviewprep.entity.InterviewQuestion;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.EvaluationRepository;
import com.interviewprep.repository.InterviewAnswerRepository;
import com.interviewprep.repository.InterviewQuestionRepository;
import com.interviewprep.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewRepository interviewRepository;
    private final AiServiceClient aiServiceClient;

    public EvaluationService(
        EvaluationRepository evaluationRepository,
        InterviewQuestionRepository questionRepository,
        InterviewAnswerRepository answerRepository,
        InterviewRepository interviewRepository,
        AiServiceClient aiServiceClient
    ) {
        this.evaluationRepository = evaluationRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.interviewRepository = interviewRepository;
        this.aiServiceClient = aiServiceClient;
    }

    @Transactional
    public void evaluateInterview(Interview interview) {
        List<InterviewQuestion> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interview.getId());
        int totalScoreAccumulator = 0;
        int evaluatedCount = 0;

        for (InterviewQuestion question : questions) {
            InterviewAnswer answer = answerRepository.findByInterviewIdAndQuestionId(interview.getId(), question.getId())
                .orElseGet(() -> {
                    InterviewAnswer fallbackAnswer = new InterviewAnswer(interview, question, "[No response provided]");
                    return answerRepository.save(fallbackAnswer);
                });

            List<String> concepts = question.getExpectedConcepts() != null && !question.getExpectedConcepts().isBlank()
                ? Arrays.asList(question.getExpectedConcepts().split(","))
                : Collections.emptyList();

            AiEvaluationResponse aiRes = aiServiceClient.evaluateAnswer(
                question.getQuestionText(),
                concepts,
                answer.getStudentAnswer(),
                interview.getTechnology()
            );

            Evaluation evaluation = evaluationRepository.findByInterviewIdAndQuestionId(interview.getId(), question.getId())
                .orElse(new Evaluation());

            evaluation.setInterview(interview);
            evaluation.setQuestion(question);
            evaluation.setAnswer(answer);
            evaluation.setScore(aiRes.getScore());
            evaluation.setCorrectness(aiRes.getCorrectness());
            evaluation.setRelevance(aiRes.getRelevance());
            evaluation.setCompleteness(aiRes.getCompleteness());
            evaluation.setStrengths(aiRes.getStrengths() != null ? String.join("||", aiRes.getStrengths()) : "");
            evaluation.setWeaknesses(aiRes.getWeaknesses() != null ? String.join("||", aiRes.getWeaknesses()) : "");
            evaluation.setImprovementSuggestions(aiRes.getImprovementSuggestions() != null ? String.join("||", aiRes.getImprovementSuggestions()) : "");
            evaluation.setMatchedConcepts(aiRes.getMatchedConcepts() != null ? String.join(",", aiRes.getMatchedConcepts()) : "");
            evaluation.setMissedConcepts(aiRes.getMissedConcepts() != null ? String.join(",", aiRes.getMissedConcepts()) : "");
            evaluation.setModelAnswer(aiRes.getModelAnswer() != null ? aiRes.getModelAnswer() : question.getSampleIdealAnswer());
            evaluation.setExplanation(aiRes.getExplanation() != null ? aiRes.getExplanation() : "");
            evaluation.setAiProvider(aiRes.getProvider());

            evaluationRepository.save(evaluation);
            totalScoreAccumulator += aiRes.getScore();
            evaluatedCount++;
        }

        int avgScore = evaluatedCount > 0 ? (totalScoreAccumulator / evaluatedCount) : 0;
        interview.setTotalScore(avgScore);
        interviewRepository.save(interview);
    }

    @Transactional(readOnly = true)
    public EvaluationResultDto getInterviewResults(Long interviewId, Long userId) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to interview results.");
        }

        List<Evaluation> evaluations = evaluationRepository.findByInterviewId(interviewId);
        EvaluationResultDto dto = new EvaluationResultDto();
        dto.setInterviewId(interview.getId());
        dto.setTechnology(interview.getTechnology());
        dto.setDifficulty(interview.getDifficulty());
        dto.setInterviewType(interview.getInterviewType());
        dto.setOverallScore(interview.getTotalScore() != null ? interview.getTotalScore() : 0);
        dto.setCompletedAt(interview.getCompletedAt());

        List<QuestionEvaluationDto> qDtos = new ArrayList<>();
        Set<String> strengths = new LinkedHashSet<>();
        Set<String> weaknesses = new LinkedHashSet<>();
        Set<String> topics = new LinkedHashSet<>();

        for (Evaluation eval : evaluations) {
            QuestionEvaluationDto qd = new QuestionEvaluationDto();
            qd.setQuestionId(eval.getQuestion().getId());
            qd.setQuestionText(eval.getQuestion().getQuestionText());
            qd.setTopic(eval.getQuestion().getTopic());
            qd.setStudentAnswer(eval.getAnswer().getStudentAnswer());
            qd.setModelAnswer(eval.getModelAnswer());
            qd.setScore(eval.getScore());
            qd.setCorrectness(eval.getCorrectness());
            qd.setRelevance(eval.getRelevance());
            qd.setCompleteness(eval.getCompleteness());
            qd.setExplanation(eval.getExplanation() != null ? eval.getExplanation() : "");
            qd.setAiProvider(eval.getAiProvider());

            if (eval.getStrengths() != null && !eval.getStrengths().isBlank()) {
                qd.setStrengths(Arrays.asList(eval.getStrengths().split("\\|\\|")));
                strengths.addAll(qd.getStrengths());
            }
            if (eval.getWeaknesses() != null && !eval.getWeaknesses().isBlank()) {
                qd.setWeaknesses(Arrays.asList(eval.getWeaknesses().split("\\|\\|")));
                weaknesses.addAll(qd.getWeaknesses());
            }
            if (eval.getImprovementSuggestions() != null && !eval.getImprovementSuggestions().isBlank()) {
                List<String> imps = Arrays.asList(eval.getImprovementSuggestions().split("\\|\\|"));
                qd.setImprovements(imps);
                qd.setImprovementSuggestions(imps);
            }
            if (eval.getMatchedConcepts() != null && !eval.getMatchedConcepts().isBlank()) {
                qd.setMatchedConcepts(Arrays.asList(eval.getMatchedConcepts().split(",")));
            }
            if (eval.getMissedConcepts() != null && !eval.getMissedConcepts().isBlank()) {
                List<String> missed = Arrays.asList(eval.getMissedConcepts().split(","));
                qd.setMissingConcepts(missed);
                qd.setMissedConcepts(missed);
            }
            if (eval.getQuestion().getTopic() != null) {
                topics.add(eval.getQuestion().getTopic());
            }

            qDtos.add(qd);
        }

        dto.setQuestions(qDtos);
        dto.setOverallStrengths(new ArrayList<>(strengths));
        dto.setOverallWeaknesses(new ArrayList<>(weaknesses));
        dto.setRecommendedTopics(new ArrayList<>(topics));

        return dto;
    }
}

package com.interviewprep.service;

import com.interviewprep.dto.ai.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;

@Service
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);
    private final WebClient aiServiceWebClient;

    public AiServiceClient(WebClient aiServiceWebClient) {
        this.aiServiceWebClient = aiServiceWebClient;
    }

    public List<AiQuestionItemDto> generateQuestions(String technology, String difficulty, String interviewType, int count) {
        try {
            AiGenerateQuestionsRequest request = new AiGenerateQuestionsRequest(
                technology, difficulty, interviewType, count
            );

            AiGenerateQuestionsResponse response = aiServiceWebClient.post()
                .uri("/api/v1/questions/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiGenerateQuestionsResponse.class)
                .timeout(Duration.ofSeconds(15))
                .onErrorResume(e -> {
                    logger.warn("AI Microservice call failed, using backend fallback: {}", e.getMessage());
                    return Mono.just(createFallbackQuestionsResponse(technology, difficulty, count));
                })
                .block();

            if (response != null && response.getQuestions() != null && !response.getQuestions().isEmpty()) {
                return response.getQuestions();
            }
        } catch (Exception ex) {
            logger.warn("Exception communicating with AI service: {}", ex.getMessage());
        }

        return createFallbackQuestions(technology, difficulty, count);
    }

    public AiEvaluationResponse evaluateAnswer(String question, List<String> expectedConcepts, String studentAnswer, String technology) {
        try {
            AiEvaluationRequest request = new AiEvaluationRequest(question, expectedConcepts, studentAnswer, technology);

            AiEvaluationResponse response = aiServiceWebClient.post()
                .uri("/api/v1/evaluation/evaluate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiEvaluationResponse.class)
                .timeout(Duration.ofSeconds(20))
                .onErrorResume(e -> {
                    logger.warn("AI Microservice evaluation call failed, using fallback rule engine: {}", e.getMessage());
                    return Mono.just(createFallbackEvaluation(expectedConcepts, studentAnswer));
                })
                .block();

            if (response != null) {
                return response;
            }
        } catch (Exception ex) {
            logger.warn("Exception calling AI evaluation: {}", ex.getMessage());
        }

        return createFallbackEvaluation(expectedConcepts, studentAnswer);
    }

    private AiGenerateQuestionsResponse createFallbackQuestionsResponse(String tech, String diff, int count) {
        AiGenerateQuestionsResponse res = new AiGenerateQuestionsResponse();
        res.setStatus("fallback");
        res.setProvider("spring-boot-fallback");
        res.setTechnology(tech);
        res.setDifficulty(diff);
        res.setCount(count);
        res.setQuestions(createFallbackQuestions(tech, diff, count));
        return res;
    }

    private List<AiQuestionItemDto> createFallbackQuestions(String tech, String diff, int count) {
        List<AiQuestionItemDto> items = new ArrayList<>();
        Map<String, List<String[]>> defaults = new HashMap<>();

        defaults.put("Java", List.of(
            new String[]{"OOP & Method Overriding", "Explain the four pillars of OOP in Java and the difference between overriding and overloading.", "encapsulation,inheritance,polymorphism,overriding,overloading"},
            new String[]{"Memory Management", "What is the difference between Stack and Heap memory in Java?", "stack,heap,garbage collection,reference"},
            new String[]{"HashMap Architecture", "How does Java HashMap work internally and what happens during collisions?", "bucket,hashcode,equals,linkedlist,treeify"},
            new String[]{"Concurrency", "Explain volatile vs synchronized in Java multithreading.", "volatile,synchronized,thread safety,visibility,atomicity"},
            new String[]{"Garbage Collection", "Describe JVM GC generations and how G1GC functions.", "young gen,old gen,eden,g1gc,stop-the-world"}
        ));

        defaults.put("Python", List.of(
            new String[]{"Python Memory & GIL", "Explain the Python Global Interpreter Lock (GIL) and reference counting.", "gil,multithreading,reference counting,memory"},
            new String[]{"Generators & Iterators", "What is the difference between an iterator and a generator? How does yield work?", "yield,iterator,generator,memory efficiency,next"},
            new String[]{"Decorators", "How do Python decorators work and how are args/kwargs preserved?", "closure,decorator,wrapper,functools.wraps"},
            new String[]{"Data Structures", "Explain differences between List, Tuple, and Set in Python.", "mutable,immutable,hashable,performance"},
            new String[]{"Context Managers", "Explain the with statement and how __enter__ and __exit__ operate.", "context manager,resource cleanup,exception handling"}
        ));

        defaults.put("React", List.of(
            new String[]{"State vs Props", "What is the difference between props and state in React?", "props,state,immutability,re-render"},
            new String[]{"Virtual DOM & Fiber", "How does React Fiber Reconciliation work?", "virtual dom,reconciliation,fiber,keys,batching"},
            new String[]{"useEffect Hook", "Explain the purpose of useEffect dependency array and cleanup.", "useeffect,dependencies,cleanup,stale closure"},
            new String[]{"State Management", "When should you use Context API vs Redux or Zustand?", "prop drilling,global state,performance,boilerplate"},
            new String[]{"React 18 Concurrent", "Explain React 18 Concurrent features (useTransition, useDeferredValue).", "concurrent,usetransition,suspense,streaming"}
        ));

        List<String[]> list = defaults.getOrDefault(tech, defaults.get("Java"));
        for (int i = 0; i < Math.min(count, list.size()); i++) {
            String[] raw = list.get(i);
            AiQuestionItemDto q = new AiQuestionItemDto();
            q.setQuestionId("fallback-" + tech.toLowerCase() + "-" + (i + 1));
            q.setTopic(raw[0]);
            q.setQuestionText(raw[1]);
            q.setDifficulty(diff);
            q.setExpectedConcepts(Arrays.asList(raw[2].split(",")));
            q.setSampleIdealAnswer("A comprehensive answer should define the fundamental principles and outline production trade-offs.");
            items.add(q);
        }
        return items;
    }

    private AiEvaluationResponse createFallbackEvaluation(List<String> expectedConcepts, String studentAnswer) {
        AiEvaluationResponse res = new AiEvaluationResponse();
        if (studentAnswer == null || studentAnswer.trim().isEmpty() || studentAnswer.contains("[No response")) {
            res.setScore(0);
            res.setCorrectness(0);
            res.setRelevance(0);
            res.setCompleteness(0);
            res.setWeaknesses(List.of("No response was provided for this question."));
            res.setImprovementSuggestions(List.of("Review the core technical concepts and model answer."));
            res.setModelAnswer("A complete answer requires technical definitions, code references, and practical trade-offs.");
            res.setProvider("fallback-rule-engine");
            return res;
        }

        String lower = studentAnswer.toLowerCase();
        List<String> matched = new ArrayList<>();
        List<String> missed = new ArrayList<>();

        if (expectedConcepts != null) {
            for (String c : expectedConcepts) {
                if (lower.contains(c.toLowerCase().trim())) {
                    matched.add(c);
                } else {
                    missed.add(c);
                }
            }
        }

        int score = Math.min(100, Math.max(20, (matched.size() * 20) + (studentAnswer.length() > 50 ? 20 : 10)));
        res.setScore(score);
        res.setCorrectness(score / 4);
        res.setRelevance(score / 4);
        res.setCompleteness(score / 4);
        res.setMatchedConcepts(matched);
        res.setMissedConcepts(missed);
        res.setStrengths(List.of("Provided clear relevant terminology: " + (matched.isEmpty() ? "general response" : String.join(", ", matched))));
        res.setWeaknesses(missed.isEmpty() ? List.of("Could add a concrete code snippet") : List.of("Missing discussion on: " + String.join(", ", missed)));
        res.setImprovementSuggestions(List.of("Elaborate on internal mechanisms and edge cases"));
        res.setModelAnswer("A comprehensive model answer addresses key definitions, architectural flow, and performance impacts.");
        res.setProvider("fallback-rule-engine");
        return res;
    }
}

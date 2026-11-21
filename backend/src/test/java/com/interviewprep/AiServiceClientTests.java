package com.interviewprep;

import com.interviewprep.dto.ai.AiEvaluationResponse;
import com.interviewprep.dto.ai.AiQuestionItemDto;
import com.interviewprep.service.AiServiceClient;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AiServiceClientTests {

    @Test
    void testFallbackQuestionGenerationWhenServiceOffline() {
        WebClient mockWebClient = WebClient.builder().baseUrl("http://invalid-host:9999").build();
        AiServiceClient client = new AiServiceClient(mockWebClient);

        List<AiQuestionItemDto> questions = client.generateQuestions("Java", "Intermediate", "Technical", 3);

        assertNotNull(questions);
        assertEquals(3, questions.size());
        assertNotNull(questions.get(0).getQuestionText());
        assertFalse(questions.get(0).getExpectedConcepts().isEmpty());
    }

    @Test
    void testFallbackEvaluationWhenServiceOffline() {
        WebClient mockWebClient = WebClient.builder().baseUrl("http://invalid-host:9999").build();
        AiServiceClient client = new AiServiceClient(mockWebClient);

        AiEvaluationResponse response = client.evaluateAnswer(
            "What is JVM heap memory?",
            List.of("heap", "objects", "garbage collection"),
            "Heap memory stores dynamically allocated objects and is cleaned by the garbage collector.",
            "Java"
        );

        assertNotNull(response);
        assertTrue(response.getScore() >= 40);
        assertTrue(response.getMatchedConcepts().contains("heap"));
        assertNotNull(response.getModelAnswer());
    }

    @Test
    void testEmptyAnswerEvaluationReceivesZeroScore() {
        WebClient mockWebClient = WebClient.builder().baseUrl("http://invalid-host:9999").build();
        AiServiceClient client = new AiServiceClient(mockWebClient);

        AiEvaluationResponse response = client.evaluateAnswer(
            "Explain React hooks",
            List.of("useState", "useEffect"),
            "",
            "React"
        );

        assertNotNull(response);
        assertEquals(0, response.getScore());
        assertFalse(response.getWeaknesses().isEmpty());
    }
}

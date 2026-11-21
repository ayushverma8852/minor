-- =============================================================================
-- InterviewPrep AI - MySQL 8+ Database Schema
-- Database: interviewprep_ai
-- =============================================================================

CREATE DATABASE IF NOT EXISTS interviewprep_ai 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE interviewprep_ai;

-- -----------------------------------------------------------------------------
-- 1. Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Interviews Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    technology VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, CANCELLED
    total_questions INT NOT NULL DEFAULT 5,
    total_score INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_interviews_user (user_id),
    INDEX idx_interviews_status (status),
    INDEX idx_interviews_tech (technology)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Interview Questions Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    topic VARCHAR(100) DEFAULT NULL,
    difficulty VARCHAR(50) DEFAULT NULL,
    expected_concepts TEXT DEFAULT NULL,
    sample_ideal_answer TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    INDEX idx_questions_interview (interview_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Interview Answers Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    student_answer LONGTEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answers_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE,
    INDEX idx_answers_interview (interview_id),
    INDEX idx_answers_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Evaluations Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_id BIGINT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    correctness INT NOT NULL DEFAULT 0,
    relevance INT NOT NULL DEFAULT 0,
    completeness INT NOT NULL DEFAULT 0,
    strengths TEXT DEFAULT NULL,
    weaknesses TEXT DEFAULT NULL,
    improvement_suggestions TEXT DEFAULT NULL,
    matched_concepts TEXT DEFAULT NULL,
    missed_concepts TEXT DEFAULT NULL,
    model_answer LONGTEXT DEFAULT NULL,
    explanation TEXT DEFAULT NULL,
    ai_provider VARCHAR(50) DEFAULT 'mock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluations_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluations_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluations_answer FOREIGN KEY (answer_id) REFERENCES interview_answers(id) ON DELETE CASCADE,
    INDEX idx_evaluations_interview (interview_id),
    INDEX idx_evaluations_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Demo Seed User (Password is 'DemoPass123!' hashed with BCrypt)
-- Hash: $2a$10$7rKkUjS3x290c0fScmr6r.ZomI8ZqHkJxkWu7Q1Xvhg0Bfv88e2w2
-- -----------------------------------------------------------------------------
INSERT INTO users (username, email, password, full_name, role)
VALUES (
    'demouser',
    'demo@interviewprep.ai',
    '$2a$10$7rKkUjS3x290c0fScmr6r.ZomI8ZqHkJxkWu7Q1Xvhg0Bfv88e2w2',
    'Alex Morgan',
    'ROLE_USER'
) ON DUPLICATE KEY UPDATE id=id;

-- ========================
-- 1. DROP TABLES (in order to avoid FK issues)
-- ========================
DROP TABLE IF EXISTS Homework CASCADE;
DROP TABLE IF EXISTS Lesson CASCADE;
DROP TABLE IF EXISTS StudentsAchievement CASCADE;
DROP TABLE IF EXISTS Achievement CASCADE;
DROP TABLE IF EXISTS Student CASCADE;
DROP TABLE IF EXISTS Teacher CASCADE;

-- ========================
-- 2. ENUM TYPE for Course_type
-- ========================
DROP TYPE IF EXISTS course_type_enum;
CREATE TYPE course_type_enum AS ENUM ('standard', 'intensive', 'premium');

-- ========================
-- 3. CREATE TABLES
-- ========================

-- Teacher table
CREATE TABLE Teacher (
                       Username VARCHAR PRIMARY KEY,
                       Password VARCHAR NOT NULL,
                       First_Name VARCHAR(50) NOT NULL,
                       Last_Name VARCHAR(50) NOT NULL
);

-- Student table
CREATE TABLE Student (
                       Username VARCHAR PRIMARY KEY,
                       Password VARCHAR NOT NULL,
                       First_Name VARCHAR(50) NOT NULL,
                       Last_Name VARCHAR(50) NOT NULL,
                       Birth_date DATE NOT NULL,
                       Course_type course_type_enum,
                       Teacher_Username VARCHAR REFERENCES Teacher(Username) ON DELETE SET NULL,
                       isCurrentlyEnrolled BOOLEAN DEFAULT TRUE
);

-- Achievement table
CREATE TABLE Achievement (
                           ID SERIAL PRIMARY KEY,
                           Description TEXT,
                           Name VARCHAR(100) NOT NULL
);

-- StudentsAchievement (many-to-many)
CREATE TABLE StudentsAchievement (
                                   Student_Username VARCHAR REFERENCES Student(Username) ON DELETE CASCADE,
                                   Achievement_ID INTEGER REFERENCES Achievement(ID) ON DELETE CASCADE,
                                   Awarded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (Student_Username, Achievement_ID)
);

-- Lesson table
CREATE TABLE Lesson (
                      ID SERIAL PRIMARY KEY,
                      Student_Username VARCHAR REFERENCES Student(Username) ON DELETE CASCADE,
                      Teacher_Username VARCHAR REFERENCES Teacher(Username) ON DELETE SET NULL,
                      Date DATE NOT NULL,
                      Notes TEXT
);

-- Homework table
CREATE TABLE Homework (
                        ID SERIAL PRIMARY KEY,
                        Lesson_id INTEGER REFERENCES Lesson(ID) ON DELETE CASCADE,
                        Description TEXT,
                        IsSubmittable BOOLEAN DEFAULT FALSE
);

-- ========================
-- 4. INSERT DUMMY DATA
-- ========================

-- Teachers
INSERT INTO Teacher (Username, Password, First_Name, Last_Name) VALUES
                                                                  ('alice_j', 'pass123', 'Alice', 'Johnson'),
                                                                  ('bob_s', 'pass123', 'Bob', 'Smith'),
                                                                  ('carol_w', 'pass123', 'Carol', 'White'),
                                                                  ('david_m', 'pass123', 'David', 'Miller'),
                                                                  ('eva_b', 'pass123', 'Eva', 'Brown');

-- Students
INSERT INTO Student (Username, Password, First_Name, Last_Name, Birth_date, Course_type, Teacher_Username, isCurrentlyEnrolled) VALUES
                                                                                                                                  ('john_d', 'pass123', 'John', 'Doe', '2005-06-15', 'standard', 'alice_j', TRUE),
                                                                                                                                  ('jane_s', 'pass123', 'Jane', 'Smith', '2004-08-21', 'intensive', 'bob_s', TRUE),
                                                                                                                                  ('emily_c', 'pass123', 'Emily', 'Clark', '2006-01-10', 'premium', 'carol_w', TRUE),
                                                                                                                                  ('michael_l', 'pass123', 'Michael', 'Lee', '2003-12-02', 'standard', 'alice_j', FALSE),
                                                                                                                                  ('sarah_k', 'pass123', 'Sarah', 'Kim', '2005-03-30', 'premium', 'david_m', TRUE),
                                                                                                                                  ('chris_e', 'pass123', 'Chris', 'Evans', '2004-07-07', 'standard', 'eva_b', TRUE),
                                                                                                                                  ('anna_l', 'pass123', 'Anna', 'Lopez', '2005-11-19', 'intensive', 'bob_s', TRUE),
                                                                                                                                  ('tom_w', 'pass123', 'Tom', 'Walker', '2006-04-04', 'premium', 'carol_w', FALSE),
                                                                                                                                  ('sophia_t', 'pass123', 'Sophia', 'Turner', '2005-09-09', 'intensive', 'david_m', TRUE),
                                                                                                                                  ('daniel_n', 'pass123', 'Daniel', 'Nguyen', '2003-10-23', 'standard', 'alice_j', TRUE);

-- Achievements
INSERT INTO Achievement (Description, Name) VALUES
                                              ('Completed beginner course', 'Level 1 Complete'),
                                              ('Performed at recital', 'Recital Star'),
                                              ('Mastered 10 songs', 'Song Master'),
                                              ('Perfect attendance', 'Dedicated Student'),
                                              ('Helped other students', 'Mentor'),
                                              ('Won a local competition', 'Local Champ'),
                                              ('Uploaded first video', 'Online Performer'),
                                              ('Wrote an original song', 'Songwriter'),
                                              ('Improved 2 levels in 1 term', 'Fast Learner'),
                                              ('Best progress of the month', 'Student of the Month');

-- Student Achievements
INSERT INTO StudentsAchievement (Student_Username, Achievement_ID, Awarded_at) VALUES
                                                                                 ('john_d', 1, '2024-01-15'),
                                                                                 ('john_d', 4, '2024-03-01'),
                                                                                 ('jane_s', 2, '2024-02-20'),
                                                                                 ('jane_s', 3, '2024-04-11'),
                                                                                 ('emily_c', 5, '2024-03-17'),
                                                                                 ('michael_l', 6, '2024-01-05'),
                                                                                 ('sarah_k', 1, '2024-03-22'),
                                                                                 ('chris_e', 9, '2024-04-02'),
                                                                                 ('anna_l', 8, '2024-03-25'),
                                                                                 ('tom_w', 10, '2024-04-03'),
                                                                                 ('sophia_t', 7, '2024-02-28'),
                                                                                 ('daniel_n', 3, '2024-03-19');

-- Lessons (50 total, randomized)
DO $$
BEGIN
FOR i IN 1..50 LOOP
    INSERT INTO Lesson (Student_Username, Teacher_Username, Date, Notes)
    VALUES (
        (SELECT Username FROM Student ORDER BY RANDOM() LIMIT 1),
        (SELECT Username FROM Teacher ORDER BY RANDOM() LIMIT 1),
        CURRENT_DATE - (random() * 100)::int,
        CONCAT('Lesson notes #', i)
    );
END LOOP;
END;
$$;

-- Homework for 30 random lessons
INSERT INTO Homework (Lesson_id, Description, IsSubmittable)
SELECT ID, CONCAT('Practice Exercise for lesson ', ID), (random() > 0.5)
FROM Lesson
ORDER BY RANDOM()
  LIMIT 30;

import bcrypt from "bcryptjs";
import { connectDb } from "./config/db";
import { Database } from "./config/Database";
import { UserDocument, USER_COLLECTION } from "./models/User";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "./models/Vocabulary";
import { QuizDocument, QUIZ_COLLECTION } from "./models/Quiz";
import { TopicDocument, TOPIC_COLLECTION } from "./models/Topic";
import { LessonDocument, LESSON_COLLECTION } from "./models/Lesson";
import { GrammarDocument, GRAMMAR_COLLECTION } from "./models/Grammar";
import { QuestionDocument, QUESTION_COLLECTION } from "./models/Question";

const seed = async () => {
  await connectDb();
  const db = Database.getInstance();

  const users = db.getCollection<UserDocument>(USER_COLLECTION);
  const topics = db.getCollection<TopicDocument>(TOPIC_COLLECTION);
  const lessons = db.getCollection<LessonDocument>(LESSON_COLLECTION);
  const vocabs = db.getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);
  const grammars = db.getCollection<GrammarDocument>(GRAMMAR_COLLECTION);
  const quizzes = db.getCollection<QuizDocument>(QUIZ_COLLECTION);
  const questions = db.getCollection<QuestionDocument>(QUESTION_COLLECTION);

  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123";

  const existingAdmin = await users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await users.insertOne({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN"
    } as UserDocument);
    console.log("Created admin user: admin@example.com / Admin123");
  } else {
    console.log("Admin user already exists");
  }

  const topicCount = await topics.countDocuments();
  if (topicCount === 0) {
    const topicData: TopicDocument[] = [
      {
        title: "Family",
        description: "Learn vocabulary and grammar about family.",
        order: 1,
        level: "A2",
        isPublished: true
      } as TopicDocument,
      {
        title: "Travel",
        description: "Essential English for travel situations.",
        order: 2,
        level: "B1",
        isPublished: true
      } as TopicDocument
    ];
    
    await topics.insertMany(topicData);
    const topicList = await topics.find().toArray();
    const topic1 = topicList.find(t => t.title === "Family")!;

    const lessonData: LessonDocument[] = [
      {
        topicId: topic1._id!,
        title: "Family Members",
        description: "Common family relationships.",
        order: 1,
        isPublished: true
      } as LessonDocument,
      {
        topicId: topic1._id!,
        title: "Daily Routines",
        description: "Talk about what family does every day.",
        order: 2,
        isPublished: true
      } as LessonDocument
    ];

    await lessons.insertMany(lessonData);
    const lessonList = await lessons.find().toArray();
    const lesson1 = lessonList.find(l => l.title === "Family Members")!;
    const lesson2 = lessonList.find(l => l.title === "Daily Routines")!;

    const vocabData: VocabularyDocument[] = [
      {
        lessonId: lesson1._id!,
        word: "sibling",
        meaning: "a brother or sister",
        phonetic: "/ˈsɪb.lɪŋ/",
        audioUrl: "",
        example: "She has two siblings.",
        topic: "Family",
        level: "A2"
      } as VocabularyDocument,
      {
        lessonId: lesson1._id!,
        word: "cousin",
        meaning: "the child of your aunt or uncle",
        phonetic: "/ˈkʌz.ən/",
        audioUrl: "",
        example: "My cousin lives in Canada.",
        topic: "Family",
        level: "A2"
      } as VocabularyDocument,
      {
        lessonId: lesson2._id!,
        word: "routine",
        meaning: "a regular way of doing things",
        phonetic: "/ruːˈtiːn/",
        audioUrl: "",
        example: "Morning routines help us stay organized.",
        topic: "Family",
        level: "A2"
      } as VocabularyDocument
    ];

    await vocabs.insertMany(vocabData);
    const seededVocabs = await vocabs.find().toArray();

    await grammars.insertMany([
      {
        lessonId: lesson1._id!,
        title: "Possessive Pronouns",
        description: "Use my, your, his, her, our, their to show ownership.",
        examples: ["This is my brother.", "Their house is big."]
      } as GrammarDocument,
      {
        lessonId: lesson2._id!,
        title: "Present Simple",
        description: "Use present simple for habits and routines.",
        examples: ["I wake up early.", "She goes to school."]
      } as GrammarDocument
    ]);

    await quizzes.insertOne({
      scopeType: "LESSON",
      scopeId: lesson1._id!,
      title: "Family Members Quiz",
      passScore: 70,
      isPublished: true
    } as QuizDocument);
    const lessonQuiz = await quizzes.findOne({ title: "Family Members Quiz" });

    if (lessonQuiz) {
      await questions.insertMany([
        {
          quizId: lessonQuiz._id!,
          sourceType: "VOCAB",
          sourceId: seededVocabs[0]._id!,
          question: "What does 'sibling' mean?",
          options: ["a brother or sister", "a parent", "a neighbor", "a pet"],
          correctAnswer: "a brother or sister",
          type: "MCQ"
        } as QuestionDocument,
        {
          quizId: lessonQuiz._id!,
          sourceType: "VOCAB",
          sourceId: seededVocabs[1]._id!,
          question: "Choose the correct meaning of 'cousin'.",
          options: ["a friend", "the child of your aunt or uncle", "a teacher", "a sibling"],
          correctAnswer: "the child of your aunt or uncle",
          type: "MCQ"
        } as QuestionDocument
      ]);
    }

    console.log("Seeded topics, lessons, vocabulary, grammar, quizzes, questions");
  } else {
    console.log("Learning content already exists");
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

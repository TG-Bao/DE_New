import { TopicRepository } from "../repositories/TopicRepository";
import { TopicDocument } from "../models/Topic";

export class TopicService {
  constructor(private topicRepo: TopicRepository) {}

  listPublished() {
    return this.topicRepo.listPublished();
  }

  listAll() {
    return this.topicRepo.listAll();
  }

  create(data: Omit<TopicDocument, "_id">) {
    return this.topicRepo.create(data);
  }

  update(id: string, data: Partial<TopicDocument>) {
    return this.topicRepo.update(id, data);
  }

  remove(id: string) {
    return this.topicRepo.remove(id);
  }
}

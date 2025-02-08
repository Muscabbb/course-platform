type CACHE_TAGS = "users" | "product" | "course";

export function getGlobalTag(tag: CACHE_TAGS) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAGS, id: string) {
  return `id:${id}-${tag}` as const;
}

export function getUserTag(tag: CACHE_TAGS, userId: string) {
  return `userId:${userId}-${tag}` as const;
}

export function getCourseTag(tag: CACHE_TAGS, courseId: string) {
  return `course:${courseId}-${tag}` as const;
}

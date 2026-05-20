const PROFANITY_LIST = [
  "씨발", "시발", "씨팔", "시팔", "씨빨", "시빨",
  "개새끼", "개새", "개색끼", "개색기",
  "병신", "벵신",
  "미친놈", "미친년", "미친새끼", "미친",
  "새끼", "새기", "쌔끼",
  "느금마", "니애미", "니엄마", "니어미",
  "창녀", "창년",
  "보지", "보짓",
  "자지", "자짓",
  "좆", "쫓",
  "씹새끼", "씹년", "씹놈",
  "걸레",
  "꺼져",
  "뒤져", "뒤지",
  "닥쳐",
  "존나", "졌나", "지랄", "지럴",
  "개같은", "개같이", "개년", "개놈",
  "fuck", "shit", "bitch", "asshole", "bastard",
];

const normalize = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "");

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  return PROFANITY_LIST.some((word) => normalized.includes(normalize(word)));
}

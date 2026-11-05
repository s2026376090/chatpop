export function avatarFromSeed(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}`;
}

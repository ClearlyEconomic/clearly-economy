/** ADMIN_GITHUB_USERNAMES는 콤마로 구분된 허용 GitHub 사용자명 목록입니다. */
export function isAllowedGitHubUser(login: string): boolean {
  const raw = process.env.ADMIN_GITHUB_USERNAMES ?? "";
  const allowed = raw
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(login.toLowerCase());
}

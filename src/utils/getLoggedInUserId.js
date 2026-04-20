/**
 * Logged-in user id for API routes. `userDetails` is only loaded after a pet exists
 * (see Topbar); Google / first-time users must use auth state.
 */
export function getLoggedInUserId(state) {
  return (
    state.userDetails?.userDetails?.id ?? state.auth?.user?.user?.id
  );
}

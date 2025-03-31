import { auth } from "./api/auth/auth";
import SignIn from "./components/signin";
// Main App Component
export default async function Page() {
  const session = await auth();
  const user = session?.user || null;

  return (
    <div>
      {session ? <div>Welcome, {user?.name || "User"}!</div> : <SignIn />}
    </div>
  );
}

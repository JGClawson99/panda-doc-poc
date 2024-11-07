import Link from "next/link";

import { LatestPost, } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { LatestUser } from "~/app/_components/user";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.user.getUsers.prefetch();
  }

  return (
    <HydrateClient>
      <main className="">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Pandadoc App
          </h1>
          <div className="flex flex-col items-center gap-2">

            <div className="flex flex-col items-center justify-center gap-4">
              {/* <Link
              className="cursor-pointer"
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
              ><Button>{session ? "Sign out" : "Sign in"}</Button>
              </Link> */}
            </div>
          </div>
          {session?.user && <LatestUser />}
        </div>
      </main>
    </HydrateClient>
  );
}

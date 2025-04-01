import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { Button, Center, Spinner } from "@chakra-ui/react";
import type { NextPageWithLayout } from "~/pages/_app";
import { AppLayout } from "~/components/Global/Layout";
import { useRouter } from "next/router";
import Image from "next/image";

const Home: NextPageWithLayout = () => {
  const { status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return (
      <Center h={"90vh"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="teal.400"
          color=""
          size="xl"
        />
      </Center>
    );
  }

  if (status === "authenticated") {
    void router.push("/admin/dashboard");
  }

  return (
    <>
      <Head>
        <title>Faith In Five</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container mb-36 flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Image
            src={"/faith_in_five_logo.png"}
            alt={"No Logo"}
            width={400}
            height={400}
          />
          <div className="flex flex-col items-center gap-2">

            <Button
              colorScheme="teal"
              width="20rem"
              size="md"
              onClick={() => void signIn(undefined, { callbackUrl: "/admin/map-view" })}
            >
              Sign In
            </Button>

          </div>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;

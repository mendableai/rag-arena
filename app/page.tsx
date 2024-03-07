"use client";

import { ChatBots } from "@/components/main-tool";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogPopUp,
  DialogTrigger,
  dialogClose,
} from "@/components/ui/dialogPopUp";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Main() {
  const [shouldShowDialog, setShouldShowDialog] = useState(true);

  useEffect(() => {
    const appStateRaw = localStorage.getItem("ragArenaAppState");
    const appState = appStateRaw ? JSON.parse(appStateRaw) : {};
    const now = new Date();

    if (
      !appState.ragArenaVisitExpiry ||
      new Date(appState.ragArenaVisitExpiry) < now
    ) {
      setShouldShowDialog(true);
      const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      appState.ragArenaVisitExpiry = inTwoDays.toISOString();
      localStorage.setItem("ragArenaAppState", JSON.stringify(appState));
    }
  }, []);

  return (
    <>
      <div className="h-[700px] max-w-6xl border m-auto mt-24">
        <ChatBots />
        {shouldShowDialog && (
          <DialogPopUp defaultOpen={true}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden"></Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex justify-center items-center h-full">
                <CardContainer className="inter-var">
                  <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                    <CardItem
                      translateZ="50"
                      className="flex justify-center items-center text-xl font-bold text-neutral-600 dark:text-white w-full"
                    >
                      <Image
                        src="/rag-arenalogo.png"
                        width="80"
                        height="80"
                        className="object-cover rounded-xl group-hover/card:shadow-xl mb-6"
                        alt="thumbnail"
                      />
                    </CardItem>
                    <CardItem
                      translateZ="50"
                      className="flex justify-center items-center text-xl font-bold text-neutral-600 dark:text-white w-full"
                    >
                      Welcome to RAG Arena
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 font-thin"
                    >
                      <span className="text-neutral-600 font-bold"></span>
                      RAG Arena is an open-source project by{" "}
                      <a
                        className="text-neutral-600 font-black"
                        href="https://mendable.ai/"
                      >
                        Mendable.ai
                      </a>{" "}
                      with the goal of finding the best retreival methods.
                      <br /> <br />{" "}
                      <span className="text-neutral-600 font-bold">
                        Instructions:
                      </span>{" "}
                      Ask a question and vote for the response with the most
                      relevant sources + answer. By default model is retrieving
                      from Paul Graham&apos;s essays on startups which you can{" "}
                      <a href="https://paulgraham.com/articles.html">
                        find here.
                      </a>{" "}
                      You can also add you own custom data to test on by
                      clicking Ingest Custom Data.
                      <br /> <br />
                      <span className="text-neutral-600 font-bold">
                        Want to help us expand RAG Arena:
                      </span>{" "}
                      We are looking for contributors. Feel free to submit a PR.
                      🚀
                    </CardItem>

                    <div className="flex justify-between items-center mt-10">
                      <CardItem
                        translateZ={20}
                        as="button"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                      >
                        <a
                          href="https://github.com/mendableai/rag-arena"
                          target="_BLANK"
                        >
                          Visit Repository →
                        </a>
                      </CardItem>

                      <span onClick={() => dialogClose()}>
                        <CardItem
                          translateZ={20}
                          as="button"
                          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                        >
                          Try it out
                        </CardItem>
                      </span>
                    </div>
                  </CardBody>
                </CardContainer>
              </div>
            </DialogContent>
          </DialogPopUp>
        )}
      </div>
    </>
  );
}

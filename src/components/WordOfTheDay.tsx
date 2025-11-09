"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, RefreshCw, Sun, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  CachedWord,
  readSavedTopics,
  saveTopics,
  useWordOfTheDay,
} from "@/hooks/useWordOfTheDay";

const DEFAULT_TOPICS = ["technology"];

const formatWord = (value?: string) => value?.trim() ?? "";

const toTopicLabel = (topic: string) =>
  topic.length > 1
    ? topic.charAt(0).toUpperCase() + topic.slice(1)
    : topic.toUpperCase();

const pronounceWord = (word: string) => {
  if (typeof window === "undefined" || !word) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};

const WordCard = ({
  topic,
  darkMode,
  isLoading,
  word,
  error,
  onRefresh,
  onRemoveTopic,
}: {
  topic: string;
  darkMode: boolean;
  isLoading: boolean;
  word: CachedWord | null;
  error: string | null;
  onRefresh: () => void;
  onRemoveTopic: (topic: string) => void;
}) => {
  const topicLabel = toTopicLabel(topic);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </>
      );
    }

    if (error) {
      return (
        <div
          className={`rounded-lg border p-6 text-center ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-gray-200"
              : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          <p className="font-semibold">We couldn&apos;t load today&apos;s word.</p>
          <p className="mt-2 text-sm">{error}</p>
          <Button className="mt-4" variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }

    if (!word) {
      return (
        <div
          className={`rounded-lg border p-6 text-center ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-gray-200"
              : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          <p className="font-semibold">No word available yet.</p>
          <p className="mt-2 text-sm">
            Tap refresh to request a new entry for this topic.
          </p>
          <Button className="mt-4" variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Fetch word
          </Button>
        </div>
      );
    }

    const synonyms = word.synonyms?.length ? word.synonyms : [];
    const antonyms = word.antonyms?.length ? word.antonyms : [];

    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${
                darkMode ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              {topicLabel} · {word.date}
            </p>
            <h3
              className={`mt-1 text-3xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {formatWord(word.word)}
            </h3>
          </div>
          <Button
            variant="secondary"
            className={`rounded-full px-4 ${
              darkMode
                ? "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/60"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
            onClick={() => pronounceWord(word.word)}
          >
            Pronounce
          </Button>
        </div>
        <p
          className={`text-sm ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {formatWord(word.pronunciation)}
        </p>
        <div
          className={`rounded-lg border px-4 py-3 ${
            darkMode ? "border-gray-600 bg-gray-700/60" : "border-gray-200 bg-gray-50"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              darkMode ? "text-emerald-300" : "text-emerald-600"
            }`}
          >
            {formatWord(word.partOfSpeech)}
          </span>
          <p className={`mt-2 text-base leading-relaxed ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {formatWord(word.meaning)}
          </p>
        </div>
        <div
          className={`rounded-lg border px-4 py-3 ${
            darkMode ? "border-gray-600 bg-gray-700/60" : "border-gray-200 bg-gray-50"
          }`}
        >
          <p
            className={`text-sm italic ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {formatWord(word.usage)}
          </p>
        </div>
        <Tabs defaultValue="synonyms" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-2 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
            <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
          </TabsList>
          <TabsContent value="synonyms" className="mt-2">
            {synonyms.length ? (
              <div className="flex flex-wrap gap-2">
                {synonyms.map((synonym) => (
                  <span
                    key={synonym}
                    className={`rounded-full px-3 py-1 text-sm ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {synonym.charAt(0).toUpperCase() +
                      synonym.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            ) : (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No synonyms provided.
              </p>
            )}
          </TabsContent>
          <TabsContent value="antonyms" className="mt-2">
            {antonyms.length ? (
              <div className="flex flex-wrap gap-2">
                {antonyms.map((antonym) => (
                  <span
                    key={antonym}
                    className={`rounded-full px-3 py-1 text-sm ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {antonym.charAt(0).toUpperCase() +
                      antonym.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            ) : (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No antonyms provided.
              </p>
            )}
          </TabsContent>
        </Tabs>
        <div
          className={`rounded-lg border px-4 py-3 ${
            darkMode ? "border-gray-600 bg-gray-700/60" : "border-gray-200 bg-gray-50"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              darkMode ? "text-emerald-300" : "text-emerald-600"
            }`}
          >
            Origin
          </p>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {formatWord(word.origin)}
          </p>
        </div>
      </>
    );
  }, [darkMode, error, isLoading, onRefresh, topicLabel, word]);

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-transform hover:-translate-y-1 ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-white"
      }`}
    >
      <CardHeader
        className={`space-y-4 border-b ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase ${
                darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-600"
              }`}
            >
              {topicLabel}
            </span>
            <CardTitle
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Word of the Day
            </CardTitle>
            <CardDescription
              className={darkMode ? "text-gray-400" : "text-gray-500"}
            >
              Discover a curated vocabulary pick tailored to your interests.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Refresh ${topic}`}
              onClick={onRefresh}
              className={darkMode ? "text-gray-300" : "text-gray-500"}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${topic}`}
              onClick={() => onRemoveTopic(topic)}
              className={darkMode ? "text-gray-300" : "text-gray-500"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`flex flex-1 flex-col gap-5 p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {content}
      </CardContent>
    </Card>
  );
};

const WordOfTheDay = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const stored = readSavedTopics();
    if (stored.length) {
      setTopics(stored);
    } else {
      setTopics(DEFAULT_TOPICS);
    }
  }, []);

  useEffect(() => {
    saveTopics(topics);
  }, [topics]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const { states, topics: activeTopics, refresh, isAnyLoading } =
    useWordOfTheDay(topics);

  const handleAddTopic = () => {
    const sanitized = newTopic.trim().toLowerCase();
    if (!sanitized) return;
    if (topics.includes(sanitized)) {
      setNewTopic("");
      return;
    }
    setTopics((prev) => [...prev, sanitized]);
    setNewTopic("");
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics((prev) => prev.filter((item) => item !== topic));
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${
        darkMode
          ? "from-gray-950 via-gray-900 to-emerald-900"
          : "from-emerald-50 via-white to-blue-50"
      } transition-colors duration-300`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-3xl border px-6 py-8 shadow-lg sm:flex-row sm:items-center sm:justify-between lg:px-10 lg:py-12 backdrop-blur">
          <div className="max-w-xl space-y-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-emerald-700"
              }`}
            >
              Vocabulary Coach
            </span>
            <h1
              className={`text-3xl font-semibold sm:text-4xl lg:text-5xl ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Elevate your vocabulary, one topic at a time.
            </h1>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Select the domains you care about and receive a hand-picked word each day.
              Everything stays cached locally, so you always know where you left off.
            </p>
          </div>
          <div className="flex items-center self-start rounded-2xl border px-4 py-3 shadow-lg sm:self-auto">
            <div className="flex items-center space-x-3">
              <Sun
                className={`h-5 w-5 ${
                  darkMode ? "text-gray-500" : "text-yellow-500"
                }`}
              />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
              <Moon
                className={`h-5 w-5 ${
                  darkMode ? "text-blue-400" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,320px),1fr]">
          <aside
            className={`space-y-6 rounded-3xl border p-6 shadow-lg ${
              darkMode ? "border-gray-800 bg-gray-900" : "border-white bg-white/90"
            }`}
          >
            <div className="space-y-2">
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Topics
              </h2>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Tailor your daily words to the subjects that matter most.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <input
                value={newTopic}
                onChange={(event) => setNewTopic(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="e.g. marketing"
                className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  darkMode
                    ? "border-gray-700 bg-gray-950 text-white placeholder:text-gray-500"
                    : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                }`}
              />
              <Button
                className="rounded-xl"
                onClick={handleAddTopic}
                type="button"
              >
                Add topic
              </Button>
            </div>
            {topics.length ? (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm shadow-sm ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {toTopicLabel(topic)}
                    <button
                      type="button"
                      aria-label={`Remove ${topic}`}
                      onClick={() => handleRemoveTopic(topic)}
                      className="text-base leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-red-500">
                Add at least one topic to get started.
              </p>
            )}
          </aside>
          <section className="space-y-6">
            {isAnyLoading && !activeTopics.length ? (
              <div className="flex items-center justify-center">
                <Skeleton className="h-64 w-full max-w-md rounded-3xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {activeTopics.length ? (
                  activeTopics.map((topic) => {
                    const state = states[topic] ?? {
                      data: null,
                      isLoading: false,
                      error: null,
                    };
                    return (
                      <WordCard
                        key={topic}
                        topic={topic}
                        darkMode={darkMode}
                        isLoading={state.isLoading}
                        word={state.data}
                        error={state.error}
                        onRefresh={() => refresh([topic])}
                        onRemoveTopic={handleRemoveTopic}
                      />
                    );
                  })
                ) : (
                  <Card
                    className={
                      darkMode
                        ? "bg-gray-900 text-white shadow-lg"
                        : "bg-white text-gray-700 shadow-lg"
                    }
                  >
                    <CardHeader>
                      <CardTitle>No topics selected</CardTitle>
                      <CardDescription className="text-base">
                        Add at least one topic to fetch your personalized word of the
                        day.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            )}
          </section>
        </section>

        <footer
          className={`mt-4 text-center text-sm ${
            darkMode ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Words are cached locally per topic so you can stay focused without extra
          network calls.
        </footer>
      </div>
    </div>
  );
};

export default WordOfTheDay;


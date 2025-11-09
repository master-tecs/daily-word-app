 "use client";

 import { useCallback, useEffect, useMemo, useRef, useState } from "react";

 export type CachedWord = {
   date: string; // YYYY-MM-DD
   topic: string;
   word: string;
   meaning: string;
   synonyms: string[];
   antonyms: string[];
   pronunciation?: string;
   partOfSpeech?: string;
   usage?: string;
   origin?: string;
 };

 export type TopicState = {
   data: CachedWord | null;
   isLoading: boolean;
   error: string | null;
 };

 type TopicStates = Record<string, TopicState>;

 const STORAGE_KEY = "wordOfTheDayCache";
 const TOPIC_STORAGE_KEY = "wordOfTheDayTopics";
 const MAX_RETENTION_DAYS = 40;

 const todayKey = () => new Date().toISOString().split("T")[0];

 type CacheMap = Record<string, CachedWord>;

 const getBaseUrl = () =>
   process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL ?? "";

 const sanitizeTopic = (topic: string) => topic.trim().toLowerCase();

 const pruneOldEntries = (cache: CacheMap): CacheMap => {
   const cutoff = new Date();
   cutoff.setDate(cutoff.getDate() - MAX_RETENTION_DAYS);
   const cutoffKey = cutoff.toISOString().split("T")[0];

   return Object.entries(cache).reduce<CacheMap>((acc, [topic, entry]) => {
     if (entry.date >= cutoffKey) {
       acc[topic] = entry;
     }
     return acc;
   }, {});
 };

 const readCache = (): CacheMap => {
   if (typeof window === "undefined") return {};
   try {
     const raw = window.localStorage.getItem(STORAGE_KEY);
     if (!raw) return {};
     const parsed = JSON.parse(raw) as CacheMap;
     return pruneOldEntries(parsed);
   } catch (error) {
     console.warn("Failed to parse cached words", error);
     return {};
   }
 };

 const writeCache = (cache: CacheMap) => {
   if (typeof window === "undefined") return;
   const pruned = pruneOldEntries(cache);
   window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
 };

 export const readSavedTopics = (): string[] => {
   if (typeof window === "undefined") return [];
   try {
     const raw = window.localStorage.getItem(TOPIC_STORAGE_KEY);
     if (!raw) return [];
     const parsed = JSON.parse(raw) as string[];
     return parsed.map(sanitizeTopic).filter(Boolean);
   } catch {
     return [];
   }
 };

 export const saveTopics = (topics: string[]) => {
   if (typeof window === "undefined") return;
   const unique = Array.from(new Set(topics.map(sanitizeTopic))).filter(Boolean);
   window.localStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify(unique));
 };

 type UseWordOfTheDayOptions = {
   preload?: boolean;
 };

 export const useWordOfTheDay = (
   topics: string[],
   options: UseWordOfTheDayOptions = {}
 ) => {
   const { preload = true } = options;
   const [states, setStates] = useState<TopicStates>(() =>
     topics.reduce<TopicStates>((acc, topic) => {
       acc[topic] = { data: null, isLoading: preload, error: null };
       return acc;
     }, {})
   );
   const cacheRef = useRef<CacheMap>({});
   const activeTopics = useMemo(
     () => topics.map(sanitizeTopic).filter(Boolean),
     [topics]
   );
   const baseUrl = useMemo(() => getBaseUrl(), []);

   const setTopicState = useCallback(
     (topic: string, partial: Partial<TopicState>) => {
       setStates((prev) => ({
         ...prev,
         [topic]: { ...prev[topic], ...partial },
       }));
     },
     []
   );

   const loadFromCache = useCallback(() => {
     cacheRef.current = readCache();
   }, []);

   const fetchTopic = useCallback(
     async (topic: string) => {
       const sanitizedTopic = sanitizeTopic(topic);
       if (!sanitizedTopic) return;

       setTopicState(sanitizedTopic, { isLoading: true, error: null });

       try {
         const url =
           baseUrl && baseUrl.startsWith("http")
             ? (() => {
                 const resolved = new URL(baseUrl);
                 resolved.searchParams.set("topic", sanitizedTopic);
                 return resolved;
               })()
             : (() => {
                 const resolved = new URL(
                   `/webhook/word`,
                   window.location.origin
                 );
                 resolved.searchParams.set("topic", sanitizedTopic);
                 return resolved;
               })();

         const response = await fetch(url.toString(), {
           headers: {
             "Content-Type": "application/json",
           },
           cache: "no-store",
         });

         if (!response.ok) {
           throw new Error(`Request failed with status ${response.status}`);
         }

         const rawData = await response.json();
         const payload =
           Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
         const payloadRecord = (payload ?? {}) as Record<string, unknown>;
         const getString = (value: unknown) =>
           typeof value === "string" && value.trim().length > 0
             ? value
             : undefined;
         const getStringArray = (value: unknown) => {
           if (Array.isArray(value)) {
             return value
               .map((item) => getString(item))
               .filter((item): item is string => Boolean(item));
           }
           return [];
         };
         const resolvedTopic = sanitizeTopic(
           getString(payloadRecord.Topic) ?? sanitizedTopic
         );
         const resolvedDate =
           getString(payloadRecord.Date) ?? getString(payloadRecord.date);
         const synonyms =
           getStringArray(
             payloadRecord.Synonyms ?? payloadRecord.synonyms ?? payloadRecord.synonym
           ) ?? [];
         const antonyms =
           getStringArray(
             payloadRecord.Antonyms ?? payloadRecord.antonyms ?? payloadRecord.antonym
           ) ?? [];
         const normalized: CachedWord = {
           topic: resolvedTopic,
           date: resolvedDate ?? todayKey(),
           word:
             getString(payloadRecord.Word) ??
             getString(payloadRecord.word) ??
             "N/A",
           meaning:
             getString(payloadRecord.Meaning) ??
             getString(payloadRecord.meaning) ??
             "",
           synonyms,
           antonyms,
           pronunciation:
             getString(payloadRecord.Pronunciation) ??
             getString(payloadRecord.pronunciation) ??
             "",
           partOfSpeech:
             getString(payloadRecord.PartOfSpeech) ??
             getString(payloadRecord.partOfSpeech) ??
             getString(payloadRecord.wordType),
           usage:
             getString(payloadRecord.UsageExample) ??
             getString(payloadRecord.usage) ??
             getString(payloadRecord.example),
           origin:
             getString(payloadRecord.Origin) ??
             getString(payloadRecord.origin) ??
             "",
         };

         const topicKey = sanitizedTopic;
         cacheRef.current = {
           ...cacheRef.current,
           [topicKey]: { ...normalized, topic: resolvedTopic },
         };
         writeCache(cacheRef.current);

         setTopicState(topicKey, {
           data: normalized,
           isLoading: false,
           error: null,
         });
       } catch (error) {
         console.error(`Failed to fetch word for topic "${topic}"`, error);
         setTopicState(sanitizedTopic, {
           data: cacheRef.current[sanitizedTopic] ?? null,
           isLoading: false,
           error:
             error instanceof Error
               ? error.message
               : "Unable to fetch word at this time.",
         });
       }
     },
     [baseUrl, setTopicState]
   );

   const hydrateTopicsFromCache = useCallback(
     (topicsToHydrate: string[]) => {
       const cache = cacheRef.current;
       const today = todayKey();
       topicsToHydrate.forEach((topic) => {
         const entry = cache[topic];
         if (entry && entry.date === today) {
           setTopicState(topic, {
             data: entry,
             isLoading: false,
             error: null,
           });
         } else {
           setTopicState(topic, {
             data: null,
             isLoading: preload,
             error: null,
           });
         }
       });
     },
     [preload, setTopicState]
   );

   useEffect(() => {
     loadFromCache();
     hydrateTopicsFromCache(activeTopics);
     const topicsNeedingFetch = activeTopics.filter((topic) => {
       const cached = cacheRef.current[topic];
       return !(cached && cached.date === todayKey());
     });

     if (!preload) {
       topicsNeedingFetch.forEach((topic) =>
         setTopicState(topic, { isLoading: false })
       );
       return;
     }

     if (topicsNeedingFetch.length === 0) {
       return;
     }

     topicsNeedingFetch.forEach((topic) => {
       fetchTopic(topic);
     });
   }, [
     activeTopics,
     fetchTopic,
     hydrateTopicsFromCache,
     loadFromCache,
     preload,
     setTopicState,
   ]);

  const refresh = useCallback(
     (topicsToRefresh?: string[]) => {
       const list = (topicsToRefresh ?? activeTopics).map(sanitizeTopic);
       list.forEach((topic) => {
         cacheRef.current = {
           ...cacheRef.current,
           [topic]: {
             ...(cacheRef.current[topic] ?? {
               topic,
               date: "",
               word: "",
               meaning: "",
               synonyms: [],
               antonyms: [],
             }),
             date: "", // force refetch
           },
         };
         fetchTopic(topic);
       });
     },
     [activeTopics, fetchTopic]
   );

   useEffect(() => {
     // ensure local state contains entries for new topics
     setStates((prev) => {
       const updated: TopicStates = { ...prev };
       activeTopics.forEach((topic) => {
         if (!updated[topic]) {
           updated[topic] = { data: null, isLoading: preload, error: null };
         }
       });
       return updated;
     });
   }, [activeTopics, preload]);

   const isAnyLoading = activeTopics.some(
     (topic) => states[topic]?.isLoading ?? false
   );

   return {
     topics: activeTopics,
     states,
     refresh,
     isAnyLoading,
   };
 };



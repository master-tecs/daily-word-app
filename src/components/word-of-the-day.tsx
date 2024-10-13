'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function WordOfTheDay() {
  return (
    <div className="min-h-screen bg-[#f0efe9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#faf7e8] shadow-lg">
        <CardHeader className="relative">
          <div className="absolute top-4 left-4 text-gray-500 text-sm">09:00</div>
          <div className="absolute top-4 right-4 flex space-x-1">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="w-6 h-4 bg-gray-500 rounded-full"></div>
          </div>
          <CardTitle className="text-3xl font-serif mt-8 mb-2">Word of the Day</CardTitle>
          <h2 className="text-4xl font-bold mb-4">«Personalia»</h2>
          <div className="absolute right-4 bottom-4">
            <Image
              src="/placeholder.svg?height=100&width=100"
              width={100}
              height={100}
              alt="Illustration"
              className="rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-t-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">«Personalia»</h3>
            <Button variant="ghost" size="icon" className="text-[#2c6e49]">
              <span className="sr-only">Pronounce</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </Button>
          </div>
          <p className="text-gray-500">[pur-suh-ney-lee-uh,-neyl-yuh]</p>
          <div>
            <span className="text-[#ffa41b] font-semibold">• plural noun</span>
            <p className="mt-2">
              biographical data, personal reminiscences, or the like:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-500 italic">
              <li>He could never keep the personalia out of his essays.</li>
              <li>The museum's collection of personalia offers intimate glimpses into the artist's life.</li>
            </ul>
          </div>
          <Tabs defaultValue="synonyms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
              <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
            </TabsList>
            <TabsContent value="synonyms" className="mt-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Biographical details</li>
                <li>Personal information</li>
                <li>Life particulars</li>
                <li>Individual data</li>
              </ul>
            </TabsContent>
            <TabsContent value="antonyms" className="mt-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Impersonal facts</li>
                <li>General information</li>
                <li>Public data</li>
                <li>Collective details</li>
              </ul>
            </TabsContent>
          </Tabs>
          <Card className="bg-[#faf7e8] border-none">
            <CardHeader>
              <CardTitle className="text-xl font-serif">What is the Origin?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Has ex clita quando, vis ad vide detracto. Eum id iusto viderer, eam id wisi ipsum albucius. Te tollit
                utroque appareat vel, nam vidit lorem sadipscing at. Causae vivendum recteque at sed eos ea movet.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
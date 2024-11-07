"use client";

import { SetStateAction, useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"

import { api } from "~/trpc/react";

import { useRouter } from 'next/navigation'
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DocumentCreateResponse } from "pandadoc-node-client";

export function LatestUser() {
    const [templates, setTemplates] = useState<DocumentCreateResponse[]>([]);
  const [users] = api.user.getUsers.useSuspenseQuery();
  const data = api.document.getTemplates.useQuery(); 
  console.log(templates)

  const utils = api.useUtils();
  const router = useRouter()

  const handleClick = async () => {
    try {
      const fetchedTemplates = data.data ?? []; // Handle undefined case
      setTemplates([ ...(Array.isArray(fetchedTemplates) ? fetchedTemplates : [fetchedTemplates])]); // Ensure array
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };


  return (
    <div className="w-full">
        <Table>
  <TableCaption>A list of home owners.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Phone</TableHead>
      <TableHead className="text-right">Status</TableHead>
      <TableHead className="text-right">Docs</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
    <TableRow className="cursor-pointer" key={user.id} >
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell className="text-right"><Badge>{user.emailVerified ? "Verified" : "Not verified"}</Badge></TableCell>
      <TableCell className="text-right"><Button onClick={handleClick}>Send</Button></TableCell>
    </TableRow>
  ))}
  </TableBody>
</Table>
    </div>
  );
}
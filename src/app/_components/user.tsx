"use client";

import { SetStateAction, useEffect, useState } from "react";
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
    const [fetching, setFetching] = useState(false);
    const [templates, setTemplates] = useState<DocumentCreateResponse[]>([]);
  const [users] = api.user.getUsers.useSuspenseQuery();
  const { data, error, isLoading } = api.document.getTemplates.useQuery(
    undefined, // Pass any parameters if required
    {
      enabled: fetching, // Only run the query when `isFetching` is true
    }
  );
  console.log(templates)

  useEffect(() => {
    if (data || error) {
      setFetching(false); // Reset `isFetching` after query completes
    }
  }, [data, error]);

  const utils = api.useUtils();
  const router = useRouter()

  const handleClick = () => {
    setFetching(true);
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
      <TableCell className="text-right"><Button onClick={() => handleClick()}>Send</Button></TableCell>
    </TableRow>
  ))}
  </TableBody>
</Table>
    </div>
  );
}
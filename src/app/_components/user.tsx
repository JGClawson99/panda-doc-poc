"use client";

import { useState } from "react";
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

export function LatestUser() {
  const [users] = api.user.getUsers.useSuspenseQuery();

  const utils = api.useUtils();
  const router = useRouter()


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
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
    <TableRow className="cursor-pointer" key={user.id} >
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell className="text-right"><Badge>{user.emailVerified ? "Verified" : "Not verified"}</Badge></TableCell>
    </TableRow>
  ))}
  </TableBody>
</Table>
    </div>
  );
}
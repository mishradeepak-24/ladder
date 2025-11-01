'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy } from 'lucide-react';
import UserHeading from '../pages/users/UserHeading';
import HomePage from '../layout/HomePage';
import UserHeading1 from '../pages/users/UserHeading1';

export default function DummyPage() {
  return (
    <div className=" ">
        <UserHeading1 />
    </div>
  );
}

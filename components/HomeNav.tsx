"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const features: { title: string; description: string }[] = [
  {
    title: "Bank statement upload",
    description: "Upload a PDF statement directly \u2014 no manual entry required.",
  },
  {
    title: "AI categorization",
    description: "Every transaction is automatically sorted into a spending category.",
  },
  {
    title: "Expense tracking",
    description: "A searchable table of every transaction you've uploaded.",
  },
  {
    title: "Analytics",
    description: "A visual breakdown of your spending by category.",
  },
]

export default function HomeNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>How it works</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem title="1. Upload a statement">
                Drop in a bank statement PDF from your account.
              </ListItem>
              <ListItem title="2. Automatic categorization">
                WealthBot reads and categorizes every transaction for you.
              </ListItem>
              <ListItem title="3. Track & review">
                See everything broken down in one dashboard.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2">
              {features.map((feature) => (
                <ListItem key={feature.title} title={feature.title}>
                  {feature.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/login">Login</Link>} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"li">& { title: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink render={<Link href="/register">
        <div className="flex flex-col gap-1 text-sm">
          <div className="leading-none font-medium">{title}</div>
          <div className="line-clamp-2 text-muted-foreground">{children}</div>
        </div>
      </Link>} />
    </li>
  )
}

---
title: "Kimu foods"
pubDate: 2025-04-11
description: "Recipe based groceries delivery app"
author: "Elvis Madiba"
video: "/crafts/kimu-foods.mov"
image:
  url: "/crafts/kimu-foods.png"
  alt: "Kimu foods website"
tags: ["Flutter", "Nextjs", "blogging", "learning in public"]
---

# Kimu foods

![Kimu foods website](/crafts/kimu-foods.png)

This will be a brief overview of [Kimu Foods](https://main.d1wj048yong21r.amplifyapp.com/), a recipe-based grocery delivery app. I will mostly go over the current architecture as well as my plans for it.

## Overview

Kimu Foods is built using three distinct technologies that serve different purposes. For the backend, I decided to use a GraphQL Apollo Server with Node.js. The web client is built with Next.js, though I am considering switching to Svelte. The mobile client is developed using Flutter.

## Backend

For the backend, I tried three different tools to implement a GraphQL API. I began with Go, and with the help of the [gqlgen](https://github.com/99designs/gqlgen) library, I was able to spin up a server that returned GraphQL responses.

```go
package main

import (
 "bytes"
 "io"
 "log"
 "net/http"
 "os"

 "kimu_backend/cmd/app/resolvers"
 "kimu_backend/config"
 "kimu_backend/graph"

 "github.com/99designs/gqlgen/graphql/handler"
 "github.com/99designs/gqlgen/graphql/playground"
 _ "github.com/lib/pq"
)

const defaultPort = "4000"

func main() {
 port := os.Getenv("PORT")
 if port == "" {
  port = defaultPort
 }

 db, err := config.ConnectDB()
 if err != nil {
  log.Fatal(err)
 }
 defer db.Close()

 resolver := &resolvers.Resolver{DB: db}
 srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

 http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
 http.Handle("/", logRequestsMiddleware(srv))

 log.Printf("server running on http://localhost:%s/ 🚀🚀", port)
 log.Fatal(http.ListenAndServe(":"+port, nil))
}

func logRequestsMiddleware(next http.Handler) http.Handler {
 // Open or create the log file
 logFile, err := os.OpenFile("logs/requests.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
 if err != nil {
  log.Fatalf("Failed to open log file: %v", err)
 }
 // Create a new logger that writes to the file
 logger := log.New(logFile, "", log.LstdFlags)

 return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
  // Log the request method and URL
  logger.Printf("Request: %s %s", r.Method, r.URL.Path)

  // Read and log the request body
  if r.Body != nil {
   body, err := io.ReadAll(r.Body)
   if err == nil {
    logger.Printf("Request Body: %s", string(body))
    // Replace the body so the handler can still read it
    r.Body = io.NopCloser(bytes.NewReader(body))
   } else {
    logger.Printf("Error reading body: %v", err)
   }
  }

  // Call the next handler
  next.ServeHTTP(w, r)
 })
}

```

Next, I tried using [Ktor](https://ktor.io) with Kotlin

```kotlin
package ke.kimu

import io.ktor.server.application.*
import io.ktor.server.routing.routing

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(GraphQL) {
        schema {
            packages = listOf("ke.kimu")
            queries = listOf(
                KimuQuery()
            )
        }
    }
    routing {
        graphQLPostRoute()
        graphiQLRoute()
        graphQLSDLRoute()
    }
}

class KimuQuery : Query {
    fun kimuTest(): KimuTest = KimuTest("Kimu test", "here here")
}

data class KimuTest(val name: String, val location: String)

```

I enjoyed using both languages/tools, but the main issues I faced were likely due to my lack of familiarity with the technologies. Starting with Go, I ran into difficulties when implementing complex queries and mutations. Since I had only beginner-level experience, my problem-solving skills in this context weren’t strong. Another challenge that threw me off was having to write SQL queries for my resolvers, as I didn’t see this as a viable long-term solution.

```go
// Recipes is the resolver for the recipes field.
func (r *queryResolver) Recipes(ctx context.Context) ([]*models.Recipe, error) {
 rows, err := r.DB.Query(`SELECT id, "recipeName", "categoryName", duration, people, description, amount, "imageUrl", instructions FROM "Recipe"`)
 if err != nil {
  return nil, err
 }
 defer rows.Close()
```

For Ktor and Kotlin, my inexperience again became a challenge, as I wasn’t able to efficiently implement my ideas. Another frustration was working with [Exposed](https://github.com/JetBrains/Exposed) to manipulate my database I had issues getting it to work with GraphQL. I will probably build another project using Ktor, as I really like the tool.

## Apollo Node.js

I decided to work with [Apollo](https://www.apollographql.com/docs/apollo-server) and Node.js for my backend, using a PostgreSQL database with [Prisma](https://www.prisma.io/) as the ORM.

![image.png](/crafts/go-graphql.png)

I chose a code-first approach with Nexus over a schema-first one, as it provided a simpler way to keep my types in sync from Prisma through to my queries and mutations.

## Web client

The web client is a Next.js app. Currently, it only has a [landing page](https://main.d1wj048yong21r.amplifyapp.com/), but my goal is to add the admin functionality here.

## Mobile client

The mobile client is built with Flutter, as I wanted a cross-platform application right out of the box. Here are a couple of screens from the app.

| ![sign_in.png](/crafts/sign_in.png)               | ![sign_up.png](/crafts/sign_up.png)                                 |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| ![home_screen.png](/crafts/home_screen.png)       | ![home_screen_scrolled.png](/crafts/home_screen_scrolled.png)       |
| ![recipe_details.png](/crafts/recipe_details.png) | ![recipe_details_scrolled.png](/crafts/recipe_details_scrolled.png) |
| ![categories.png](/crafts/categories.png)         | ![categories_scrolled.png](/crafts/categories_scrolled.png)         |
| ![favourites.png](/crafts/favourites.png)         | ![orders.png](/crafts/orders.png)                                   |
| ![profile.png](/crafts/profile.png)               | ![profile_scrolled.png](/crafts/profile_scrolled.png)               |

# Conclusion

This article and application are still works in progress, and I will update the article as I continue development.

[View more](/)


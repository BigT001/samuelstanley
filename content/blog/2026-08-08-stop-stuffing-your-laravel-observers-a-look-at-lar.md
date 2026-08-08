---
title: "Stop Stuffing Your Laravel Observers: A Look at Larakeep"
date: "2026-08-08T10:29:41.196Z"
excerpt: "Laravel models always start clean and end up looking like a chaotic trade fair. Here is how dedicated field keepers can salvage your backend code."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F9jf94mss5bc090pb7d1t.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/edulazaro/model-field-keepers-in-laravel-with-larakeep-4ikp"
---

My eyes were burning at 2 AM in a quiet co-working space in Gbagada when I last had to audit an invoice processing pipeline. The codebase wasn't inherently bad, but the main Invoice model had turned into an absolute monster. Calculating line-item sums, updating cached status tags, generating search blobs, computing remaining balance—everything was jammed directly into the Eloquent model or scattered across bloated observer classes.

### The Mess We Build When Models Grow

We have all been there. You start a project with high hopes and clean controllers. But three months in, after handling complex merchant orders for shops in Onitsha or payout computations for vendors in Akure, reality sets in.

You need derived fields. A field like total isn't typed in directly by the user; it is calculated from subtotal items, taxes, and discounts. A search string column needs a merged string of five different attributes. 

![Developer laptop setup](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

Normally, we fix this in one of two ways, both of which get messy fast:

1. Write private helper methods directly inside the model until the file hits 1,200 lines.
2. Move logic to a Model Observer, which starts innocent but quickly morphs into an unmaintainable garbage bin of side effects.

### Enter Larakeep

I stumbled across Edu Lazaro's package called Larakeep, and the mental model clicked immediately. It introduces a dedicated concept: a Keeper.

A Keeper is just a plain class whose only job is to return calculated values for a model's derived fields. It sits right beside your domain actions, but with a stricter focus. An Action performs an operation (like charging a card or sending a notification), while a Keeper simply produces a value for a specific field.

![Lines of Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

Here is how it works under the hood without extra friction:

You create a dedicated Keeper class—say, InvoiceKeeper—that takes your Invoice model into its constructor. Inside, every field you want to calculate gets its own method. If the column is total, the method is getTotal(). If the column is amount_due, it is getAmountDue(). The method calculates the value and returns it. It does not write to the database. It does not fire events. It just holds the formula.

On the model side, you attach a simple HasKeepers trait and a KeptBy PHP attribute pointing to the Keeper class. You can even attach multiple Keepers if one model owns distinct logical buckets of computed data.

### Running It in the Real World

To assign those computed values, you just call the process method on the model instance, passing the target field name. You can pass a single field or an array of fields. Because it returns the model instance itself, you can chain a save right at the end.

One crucial detail I respect about this design: process only sets the attributes in memory. It does not automatically execute a database query behind your back. That gives you full control. The most natural place to trigger these calls is inside the model's saving observer, guaranteeing that right before record creation or update, your calculated fields are fresh and accurate.

It also handles edge cases smoothly. If your calculation needs extra contextual data—like currency conversion rates—you can name your method with a specific suffix and pass arguments straight through using processWith. If you prefer verbs other than "get" (like refreshTotal), the processTask method accommodates that easily.

### Why This Style Matters

When you are pushing code under pressure, trying to keep backend services running reliably despite spotty power or erratic internet connections, clean organization isn't academic—it is a sanity saver.

Separating operational logic from formula logic makes unit testing painless. I can test my Keeper class in isolation without hitting the database, feeding it fake model instances and asserting raw mathematical output.

It is a refreshingly simple solution to a bloat problem that plagues almost every long-running Laravel application. Next time I refactor a heavy billing or inventory module, I know exactly where those formulas are going.
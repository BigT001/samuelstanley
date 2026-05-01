---
title: "Keeping My Sanity While Scaling with AKS"
date: "2026-05-01T20:08:39.050Z"
excerpt: "Everyone is shouting microservices these days, but setting up the foundation is where the real work happens. Here is how I’m looking at Azure’s flavor of Kubernetes."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fh8zuiqlmmncnx5fwe934.jpg"
readTime: "4 min read"
sourceUrl: "https://dev.to/lotanna_obianefo/getting-started-with-azure-kubernetes-service-aks-21fg"
---

I’ve spent too many nights staring at a frozen terminal while the humidity in Lagos tries to melt my laptop. When you’re building products in an environment where the power grid is as unpredictable as a Danfo driver in rush hour, you learn to appreciate tools that actually manage your mess for you. That is why I have been looking into Azure Kubernetes Service (AKS) lately. 

Managing your own Kubernetes cluster is a great way to lose sleep. AKS is Microsoft’s way of saying, "Let us handle the hard stuff so you can actually go get some sleep."

### The Safety Net We Call Git

Before you even touch the cloud, you have to get your local house in order. I’ve seen guys in Akure trying to build massive platforms without a proper version control strategy, and it always ends in tears. The guide I’ve been following emphasizes starting with a clean Git repository. 

![A developer focused on the screen in a busy workspace](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

It sounds basic—initializing a directory, adding a README, and making that first commit—but it is your only insurance policy. When your internet cuts out or your local machine decides to act up, having that remote history on GitHub is what keeps you from starting from scratch. In our world, "Sapa" can hit your project’s resources too; versioning ensures you don't waste precious data re-doing work you've already finished.

### Variables or Chaos?

One thing that caught my eye in the walkthrough was the heavy use of shell variables. When you are running commands like az login or setting up resource groups, it is so easy to make a typo. By defining things like your cluster name or your location—the guide uses Australia Central for some reason, though I usually lean towards European regions for better latency from Nigeria—you make the whole process repeatable.

![The organized chaos of a city scene where tech meets daily life](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

It’s about working smart. If I’m sitting in a Gbagada workstation with three other guys sharing the same fiber connection, I don’t want to be typing out long resource names every five minutes. I want to hit a variable and move on. It’s that "No gree for anybody" mindset applied to DevOps—don't let the complexity of the CLI bully you.

### Why Managed K8s Actually Matters

The core of the matter is the transition from just running a container to orchestrating a whole fleet of them. Using the Azure CLI to install kubectl and then setting up a resource group is the gateway drug to proper cloud-native engineering. 

![Abstract lines representing the flow of data and logic](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

Honestly, for a lot of the small-scale products we build for the local market, a simple VM might do. But the moment you start thinking about scale—like handling the traffic surge for a fintech app during a holiday weekend—you need something that doesn’t require you to manually provision servers at 3 AM. 

AKS handles the control plane, which is the brain of the operation. You just worry about the workers. It's not just "strategic," it's survival. If I can offload the operational headache to Azure, I have more time to focus on the UI and making sure the user experience doesn't feel like a trip through a chaotic Owerri bus park.

I’m still playing around with the resource group settings, but so far, the promise of reduced operational overhead is looking very attractive. Just remember to keep your variables tight and your commits frequent. We're building for the long haul here.
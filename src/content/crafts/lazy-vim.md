---
title: "Neovim"
pubDate: 2025-08-10
description: "Using lazy-vim to turn Neovim into a fully functional IDE."
author: "Elvis Madiba"
video: "/crafts/neo-vim.mp4"
image:
  url: "/crafts/neo-vim.png"
  alt: "Image of Neovim editor on the terminal."
tags: ["Vim", "Neovim", "blogging", "learning in public"]
---

# Neovim

## What is Neovim ?

[Neovim](https://neovim.io/) is a text editor that's a fork of [Vim](https://www.vim.org/about.php), built with the goal of being highly customisable and extensible through plugins. With the right plugins, Neovim can be transformed into a fully featured IDE (Integrated Development Environment).

In this article, I will look at Neovim and compare it to the popular IDE Visual Studio Code (VS Code) to demonstrate how Neovim can function as an IDE and how closely it can resemble VS Code. But before that, let's explore why you might want to use Neovim in the first place.

## Why use Neovim ?

The main reason to use Neovim is to leverage Vim’s powerful text editing capabilities. Vim, and consequently Neovim, has two primary modes: `Insert` mode and `Normal` mode. Insert mode functions similarly to most text editors you can type characters directly to insert text at the cursor position.

Normal mode, however, is the heart of Neovim’s editing power. It allows you to perform various actions on text using keyboard shortcuts. In this mode, you can navigate and manipulate your code _blazingly fast_ and with impressive efficiency. Since this is just a brief introduction, [here is an article](https://dev.to/insideee_dev/neovim-a-powerful-and-customizable-text-editor-an-introduction-for-beginners-17gb) that covers basic Vim navigation in more detail.

## Setting up Neovim

The obvious place to start would be installing the Neovim binary from source. However, my goal is to demonstrate how you can get a working Neovim configuration as quickly and with as little friction as possible.

Just as VS Code has many forks that build upon it to provide additional functionality such as [Cursor](https://cursor.com/) or [Project IDX](https://idx.dev/). Neovim also has several preconfigured distributions that handle most of the heavy lifting for you.

### Preconfigured Neovim

Here are some great preconfigured Neovim distributions. They all look slightly different and may have varying configurations, but their goal is the same: to get you from zero to a fully functional IDE.

- [LazyVim](https://www.lazyvim.org/) (This is the one I started with and will discuss in more detail)
- [NvChad](https://nvchad.com/)
- [LunarVim](https://www.lunarvim.org/)
- [AstroVim](https://astronvim.com/)

Of these, LazyVim is my personal choice, and it’s a great starting point for many developers. Let’s take a look.

### LazyVim

LazyVim, along with the other options mentioned above, comes preconfigured with various plugins that transform Neovim into a fully functional IDE. Let’s take a look at some of these plugins. Neovim plugins are written in the [Lua programming language](https://www.lua.org/docs.html) and provide a wide range of functionality.

For example, I build mobile apps using Flutter, so I like to have Flutter tools such as the ability to view available emulators or run Dart tests. To add such functionality, you simply include the appropriate plugin in your configuration.

![Neovim flutter plugin](/crafts/flutter-plugin.png)

Neovim flutter plugin

![VS Code Flutter plugin](/crafts/vs-code-flutter.png)

VS Code Flutter plugin

This is similar to how you would add an extension to VS Code from the extension store—except now, you’re doing it with code in Neovim. Neovim has a vast collection of plugins, so I’ll just list a few here, along with a screenshot of the ones I have installed:

- [\*\*tokyo-night](https://github.com/folke/tokyonight.nvim)\*\* – Adds the Tokyo Night theme to Neovim.
- [\*\*lazy-git](https://github.com/kdheepak/lazygit.nvim) -\*\* Provides a Git CLI interface.
- [\*\*flutter-tools](https://github.com/nvim-flutter/flutter-tools.nvim)\*\* – Adds Flutter LSP support along with other Flutter-specific tools.

![My Neovim plugins](/crafts/my-plugins.png)

Here are a couple of the plugins in action:

- Lazy-git

![Lazy-git](/crafts/lazy-git.png)

- Typescript LSP

![Typescript LSP](/crafts/ts-lsp.png)

## Language Server Protocol (LSP)

To enable features like code completion, error detection, and code formatting, IDEs use a **Language Server** to provide “language intelligence” for the specific programming language you are working with. These servers essentially define the rules for that language.

Neovim supports this through a plugin called [`mason`](https://github.com/mason-org/mason.nvim), which offers a list of available LSPs (Language Server Protocols) and instructions for configuring them. Similar to what we discussed earlier, you simply add a block of code containing your language-specific configurations, and Neovim loads them for you.

If you work with multiple programming languages, managing these configurations manually can become tedious. Fortunately, **LazyVim** includes a convenient CLI for adding and removing LSPs, much like VS Code’s extension system and it even handles updates for you.

![Lazyvim LSP plugins](/crafts/mason.png)

![VS code LSP extension](/crafts/rust-lsp.png)

# Conclusion

Since your Neovim configuration is essentially just a project folder, you can easily track and manage changes using Git making it simple to experiment with new plugins or settings without fear of breaking your setup.

Neovim’s flexibility means you can start with a minimal configuration and grow it into a powerful, fully featured IDE that’s tailored to your exact workflow. Whether you want faster navigation, better code intelligence, or a clean, distraction-free environment, Neovim can be shaped to fit your needs.

If you’re curious to get started, pick one preconfigured Neovim setup, spend an afternoon customising it for your workflow, and see how it changes your coding experience.

Before long, you’ll be able to casually drop, _“I use Vim 😅,”_ and feel like a true “Chad.”

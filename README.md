# Lark Programming Language 🚀

A simple, standalone programming language with built-in modules - **no Node.js installation required!**

![License](https://img.shields.io/github/license/kaykaypoopaa/larklanguage.lark)
![GitHub release](https://img.shields.io/github/v/release/kaykaypoopaa/larklanguage.lark)

## 📥 Installation

**[Download Lark.exe](https://github.com/kaykaypoopaa/larklanguage.lark/releases/latest)**

No dependencies needed - just download, install, and start coding!

## ✨ Features

- ✅ **Zero dependencies** - works out of the box
- ✅ **Built-in modules**: math, random, string, array, time
- ✅ **Simple syntax** - easy to learn
- ✅ **User modules** - create reusable libraries
- ✅ **Windows integration** - double-click `.lark` files to run

## 🎯 Quick Start

Create a file `hello.lark`:
```lark
import math
import random

print("Hello, Lark!")

let x = math.sqrt(25)
print("Square root of 25: " + x)

let rand = random.randint(1, 100)
print("Random number 1-100: " + rand)
```

**Run it:** Just double-click the file!

## 📚 Language Guide

### Variables
```lark
let x = 10
let name = "Lark"
x = 20  # Reassignment
```

### Functions
```lark
fun greet(name) do
  print("Hello, " + name + "!")
end

greet("World")
```

### Control Flow
```lark
if x > 10 then
  print("Big number")
else
  print("Small number")
end

while x < 100 do
  x = x + 1
end
```

### Built-in Modules

#### math
```lark
import math

print(math.pi)           # 3.14159...
print(math.sqrt(16))     # 4
print(math.pow(2, 8))    # 256
print(math.abs(-5))      # 5
print(math.max(1, 2, 3)) # 3
```

#### random
```lark
import random

print(random.random())        # 0.0 to 1.0
print(random.randint(1, 10))  # Random int
print(random.choice("abc"))   # Random char
```

#### string
```lark
import string

let text = "hello world"
print(string.upper(text))    # HELLO WORLD
print(string.len(text))      # 11
print(string.reverse(text))  # dlrow olleh
```

#### array
```lark
import array

let nums = array.create(1, 2, 3, 4, 5)
print(array.sum(nums))    # 15
print(array.avg(nums))    # 3
print(array.max(nums))    # 5
```

#### time
```lark
import time

print(time.year())    # 2025
print(time.month())   # Current month
print(time.now())     # Timestamp
```

### Creating Your Own Modules

Create `mymodule.lark`:
```lark
let version = "1.0"

fun hello() do
  print("Hello from my module!")
end

fun add(a, b) do
  return a + b
end
```

Use it in `main.lark`:
```lark
import mymodule

mymodule.hello()
let result = mymodule.add(5, 10)
print(result)  # 15
```

## 🛠️ Examples

Check out the [examples folder](./examples) for more programs!

## 🤝 Contributing

Pull requests welcome! Feel free to:
- Add new built-in modules
- Improve error messages
- Add new language features
- Fix bugs

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

## 🔧 Building from Source

For developers who want to build the executable:
```bash
# Install pkg
npm install -g pkg

# Bundle into executable
pkg lark.js --target node18-win-x64 --output lark.exe

# Create installer with Inno Setup
# Open lark-installer.iss and compile
```

## 📞 Support

Found a bug? [Open an issue](https://github.com/kaykaypoopaa/larklanguage.lark/issues)

---

Made with ❤️ by kaykaypoopaa

![License](https://img.shields.io/github/license/kaykaypoopaa/larklanguage.lark)
![GitHub release](https://img.shields.io/github/v/release/kaykaypoopaa/larklanguage.lark)
# larklanguage.lark
Lark is my newest (and first!) programming language!
Lark includes built-in modules and other stuff like: print, random, pi. Some of the modules in lark are: math, random, string, array, and time!
If you or anyone you know wants it its simple, just read the instructions section below this text.
# INSTRUCTIONS
If you would like to use this programming language you need to make a folder in C:\ (so it doesnt get the registry mixed up) also, make sure that the folder is named LarkLanguage, next you need to get all the files from the repository and put them in the LarkLanguage folder, if you dont want to put it in C:\ then you can open the .reg file after getting it from the repo for the register-lark.reg (not the unregister-lark.reg) and change the path in the bottom to whatever path the bat file is located, after that, open the register-lark.reg file and then once it registers you should be set! to be sure you did everything right, when you open a .lark file it should output some stuff and then say test completed.
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

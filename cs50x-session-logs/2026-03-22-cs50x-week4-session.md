---
date: 2026-03-22
session_type: cowork
duration_minutes: ~60
focus_area: Week 4 - Memory & Pointers
tags:
  - CS50x
  - debugging
  - malloc
  - segmentation-fault
  - valgrind
---

# CS50x Week 4 Session - 2026-03-22

## Problem Solved
**Spellchecker Segmentation Fault**

### Root Cause
Brandon's spellchecker program was crashing due to a string that was not null-terminated after `malloc()`. When the program tried to read or manipulate the string, it accessed memory beyond the allocated buffer, causing a segfault.

### Solution
Added the null terminator (`\0`) after allocating memory for the string and before using it.

**Key takeaway**: Every string in C must end with `\0` to mark its end. Without it, string functions don't know when to stop reading.

## Topics Covered

### 1. Stack vs Heap Allocation
- **Stack**: Automatic, limited size, fast, local variables
- **Heap**: Manual management via malloc/free, larger size, slightly slower, persists across function calls

### 2. Memory Management Best Practices
- Always check that `malloc()` returns a non-NULL pointer before using it
- Every `malloc()` needs a corresponding `free()` to prevent memory leaks
- Null-terminate strings after malloc: `word[length] = '\0'`

### 3. Valgrind for Early Bug Detection
Valgrind is a powerful memory debugging tool that can catch issues before they crash your program:
- **Invalid writes/reads**: Catches buffer overflows and segfaults
- **Memory leaks**: Shows exactly what memory wasn't freed
- **Uninitialized values**: Detects use of undefined variables

How to use Valgrind:
```bash
valgrind ./spellchecker dictionary.txt
```

Reading Valgrind output:
- Look for "Invalid write of X bytes" or "Invalid read"
- Note the exact line number where the problem occurred
- Stack traces show the function call chain

## Action Items / Follow-Up

- [ ] Write personal reference note on malloc/free patterns
  - Document common pitfalls
  - Create examples of correct vs incorrect usage
  - Include null-termination patterns
  
- [ ] Watch CS50 shorts on pointers again before Week 5
  - Reinforces the fundamentals before moving forward
  - Helps solidify understanding of dereferencing and address-of operators

## Key Learnings

1. **Null termination is critical**: String functions rely on finding `\0` to know where the string ends
2. **Valgrind is your friend**: Run it on every malloc-heavy program to catch bugs early
3. **Think in terms of memory regions**: Understanding stack vs heap makes memory management decisions clearer

## Resources Reviewed
- CS50 Lecture 4: Memory and Pointers
- Valgrind manual page basics
- String handling with malloc in C

---

**Next session focus**: Week 5 preparation after reviewing pointers material

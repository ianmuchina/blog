---
title: apt and apt-get notes
date: 2022-03-31
---

List packages all packages in an apt repo.
```sh
# code
ls /var/lib/apt/lists/ | 
  grep Packages |
  grep -v Index |
  fzf --preview="cat /var/lib/apt/lists/{} | grep ^Package: |  sort -u |  cut -f2 -d ':'"
```

```python
# comment
print(hello)
def main():
  hello()
```
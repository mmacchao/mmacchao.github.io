# nginx配置

## server块中的add_header在location中不生效的问题
- 当一个 location 块中包含 if 或 limit_except 这样的指令，并且这些指令的执行分支中有任何 add_header 指令时，Nginx 会忽略该 location 块以外（即 server 块）的所有 add_header 指令
- 当location块本身含有add_header也会忽略server块的内容
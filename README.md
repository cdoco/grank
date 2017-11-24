<div align=center>
    <p><img src="https://cdoco.com/images/grank.png" alt="grank"/></p>
    <a target="_blank" href="https://npmjs.org/package/grank" title="NPM version"><img src="https://img.shields.io/npm/v/grank.svg"></a>
    <a target="_blank" href="https://travis-ci.org/cdoco/grank" title="Build Status"><img src="https://travis-ci.org/cdoco/grank.svg?branch=master"></a>
    <a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
    <a target="_blank" href="http://nodejs.org/download/" title="Node version"><img src="https://img.shields.io/badge/node.js-%3E=_6.0-green.svg"></a>
</div>

## 安装

```shell
npm install -g grank
```

## 使用

### 最热项目

```shell
//用法
grank trend -s|--since <since> -l|--language <language>

//示例
grank trend -s daily -l all
```

字段|含义
-|-
since|查询天或者周或者月, 默认 daily, 可选值 daily, weekly, monthly
language|查询某个语言, 例如 c, java, node

### 搜索用户

```shell
//用法
grank user [query] -s|--sort <sort> -o|--order <order> -n|--num <num> -p|--page <page>

//示例
grank user location:china+language:c -n 5 -s followers -o desc
```

query 扩展用法, 语法格式为 keywords+key:value+key2:value:

类型|含义|示例
-|-|-
type|搜索的用户类型，user 或者 org|`type:user`
in|在何字段中进行q的搜索。通常为user的response中的字段|`in:user`
repos|数量过滤字段。根据所拥有的repos数量进行过滤|`repos:10`
location|所在地过滤|`location:china`
language|所拥有的repos语言过滤|`language:node`
followers|关注数量过滤字段|`followers:100`

可选字段

字段|含义
-|-
num|每页需要查询的数量
sort|排序依据，值可为followers, repositories, or joined。默认为 best match
order|排序顺序，desc或asc。默认为desc
page|查询第几页

---

### 搜索仓库

```shell
//用法
grank repo [query] -s|--sort <sort> -o|--order <order> -n|--num <num> -p|--page <page>

//示例
grank repo language:node -n 5 -s stars -o desc
```

query 扩展用法, 语法格式为 keywords+key:value+key2:value:

类型|含义|示例
-|-|-
in|在何字段中对q进行搜索。可用值为repository相关response中的字段|`in:c`
forks|forks字段过滤|`forks:100`
stars|同forks，过滤使用|`stars:100`
language|搜索的语言类型，例 java,c,python 等|`language:node`

可选字段

字段|含义
-|-
num|每页需要查询的数量
sort|排序依据，值可取 stars,forks,updated。默认为best match
order|排序顺序，desc或asc。默认为desc
page|查询第几页

## License

MIT
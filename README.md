# Test Project
> __Scripting Team__
-----

### 写在最前
* 下文所有的[ ], 除了- [ ], 其他的均代表变量, 根据实际情况自行填充. 输入的时候不需要把中括号输进去
* 如果有小括号和引号, 请输入进去
* 下文提到了HEAD. 这是github里面的一个指针, 指向当前的版本所处的位置. 当然, 这个指针可以更改. 而且对于不同的repo, 指针也可能不同. 对于同一个repo, 本地的HEAD与远程的HEAD也可能不同
    * 举个例子, `git clone`下来了代码, 然后加入了一段话. commit之后, 就表示本地的HEAD指针与远程的HEAD指针不同了. 因此才会允许push.
    * push更改之后, 本地指针不会变, 但是远程的指针会向前移, 来保证与你当前的指针同步.
    * 遇到出现问题的情况, 可以试着用这个思路想想解决办法

### GIT fork 后?
1. 从 url: https://github.com/S1ngS1ng/ScriptingTest.git (柳星)那里fork项目之后, 以余虹君为例, 得到带有github ID的url: https://github.com/yuhjun/ScriptingTest.git (余虹君)   
    * 参考 http://www.tuicool.com/articles/6vayqen
2. git clone 余虹君 -> 把远程repo复制到本地电脑
3. 针对`RockPaperScissors_S1ngS1ng`, 因为有依赖包(AngularJS, Bootstrap和jQuery), 因此需要首先cd到`bower.json`所在的文件夹, 打开git bash, 然后使用bower install 安装包文件

### Github上fork之后如何保持同步(Windows环境)
1. `git remote -v`
    * 这个命令用于查看所有远程库(remote repo)的远程url, 如果只输入`git remote`就是列出所有远程库.
2. `git remote add upstream 柳星`
    * 这个命令用于添加remote repo(远程库), 该操作只需操作一次即可
这个时候输入`git remote -v`,会得到结果：
origin: https://github.com/[yourName]/ScriptingTest.git (fetch)
origin: https://github.com/[yourName]/ScriptingTest.git (push)
upstream: https://github.com/S1ngS1ng/ScriptingTest.git (fetch)
upstream: https://github.com/S1ngS1ng/ScriptingTest.git (push)

* 可以用git status命令查看当前改动:
1. `git status`
    结果:
    On branch master
    Your branch is ahead of 'origin/master' by 3 commits.
      (use "git push" to publish your local commits)
    
    nothing to commit, working directory clean

2. `git pull --rebase upstream master`
    结果：
    From https://github.com/S1ngS1ng/ScriptingTest
      branch   master  ->  FETCH_HEAD
    Current branch master is up to date.

* 同步完成后 推送到自己的Github上:
3. `git push origin master`

至此, origin的master branch已经于原作者项目同步了

### 更新working branch(当前工作的branch)
* 之所以需要这么做, 是因为, 假设你开发花了三天时间. 而三天之内upstream上面更新过. 然后, 如果你在这个时候提交PR, 理论上是不能merge的. Git会报错, 因为它发现你开始工作的节点与upstream当前的HEAD指针不同了.
* 当然, 如果这三天upstream上没有任何更新, 你的PR就可以随时merge, 因为你的代码是基于**未改动的**upstream master写的, 所以不会出现conflicts
* 更新working branch, 相当于: 把upstream master上的改动应用到当前的working branch. 结果就是, 可以假装你的working branch是基于改动后的upstream master写的
1. `git checkout master`, 然后`git fetch upstream`, 然后~~`git merge`~~ 或`git rebase`
    * 首先切换到master branch (origin的master branch)
    * 是获取upstream上面所有的更新, 并获取HEAD指针.
    * 理论上, `git merge`和`git rebase` **此时** 都可以更新**origin**的master branch. 强烈推荐使用`git rebase master`. 原因见下文
5. `git checkout [workingBranch]`, 然后~~`git merge master`~~或`git rebase master`
    * 这两个命令都是把master branch(当然, 是origin上的master branch)更新的内容应用到working branch上面.
    * 区别在于, 使用`git merge`, 会让你当前在working branch上面已经做的更改与upstream master的更改在timeline上出现分支. 而使用rebase, 会把你的更改加到upstream master更改的后面, 结果是整体时间轴呈线性的, 没有分岔
    * 也可以使用`git rebase -i master`来实现交互式rebase, 这一步骤一般是在提交PR之前做, 允许用户squash commit (合并commit,把之前的几次commit合为一个)
    * 如果自己当前的branch有过改动也没关系, 在rebase的过程中, 会让你处理conflicts, 处理好之后用`git add [files]`提交改动后的特定文件或者用`git add .`提交全部文件,即可完成rebase

至此, origin上的working branch已经与原作者没有冲突, 可以随时merge

### 关于push
* 首先配置一下全局环境, `git config --global push.default simple`
* 第一次push到some branch的时候用一次`git push -u origin [someBranch]` (效果等同于`git push --set-upstream origin [someBranch]`). 以后再要push到这个branch只需要git push就可以了, 前提是, 你在这个branch上.

### 关于branch
* 本地删除branch是`git branch -d xxx`.
    * 如果有未提交的内容, 想强行删除branch, 就是`git branch -D xxx`. 谨慎使用, 这样会让你的未提交内容丢失
* 本地创建新branch的命令是`git checkout -b xxx`或`git branch xxx`
    * `git checkout -b dev` = `git branch dev` + `git checkout dev`
* 如果想在Github里删除名为dev的branch, 命令是`git push origin :dev`

### Commit
* `git commit`是把当前的改动放到Staging area(一个缓冲区)
* 记得使用`git commit -m "[commitMessage]"`
* Commit Message的写法:
    * 基本格式: [类型]([改动区域]): [主题]
    * 类型分为如下几种:
        * feat: Feature的缩写, 新的功能或特性
        * fix: bug的修复
        * ~~docs: 文件修改, 比如修改应用了ngDoc的项目的ngDoc内容~~
        * style: 格式修改. 比如改变缩进, 空格, 删除多余的空行, 补上漏掉的分号. 总之, 就是不影响代码含义和功能的修改
        * refractor: 代码重构. 一些不算修复bug也没有加入新功能的代码修改
        * perf: Performance的缩写, 提升代码性能
        * test: 测试文件的修改
        * chore: 其他的小改动. 一般为仅仅一两行的改动, 或者连续几次提交的小改动属于这种
    * 作用域:
        * 这个参数用来描述这次改动发生的位置.
        * 比如更改了css文件, 就可以把"css"放在这里. 比如更改了JS文件, 可以把"js"放在这里
        * 对于多个作用域, 可以用逗号分隔. 比如"html, png"
    * 主题:
        * 简略描述改动了什么
        * 用英文写, 用现在时, 不要用过去时. 最开头不需要大写
        * 中间可以有逗号, 但结尾**不要**有句号
        * 细节写在PR的详细内容里, 不需要写在这里
* 示例
    * 改动1: 在JS文件里修复了一个可能会使HTML不显示结果的bug
        * `git commit -m "fix(js) fix a bug that may cause rendering issue of HTML"`
    * 改动2: 在HTML里面加入了处理浏览器兼容性的代码
        * `git commit -m "feat(html) add code for browser compatibility"`
    * 改动3: 优化了AngularJS名为mainSvc的Service异步发送HTTP request性能
        * `git commit -m "perf($service) enhance async perf of mainSvc sending HTTP request"`
        
### Pull Request
* 标题采用默认设置即可. 默认为commit (或squash之后commit) 的commit message
* 详细内容栏:
    * 在第一行加上引号内的内容, "- [ ] LGTM". 别人review你的代码之后就在这儿给你打个勾, lgtm是look good to me的缩写.
    * Review别人代码的时候, 如果觉得没问题, 打钩之后在底下评论"LGTM"
    * 支持Markdown和Emoji

### 查看别人的PR
* review别人PR的时候, 建议下载到本地, 查看后再确定是否通过
* 项目路径中找到`.git/config`, 在upstream底下加上:  `fetch = +refs/pull/*/head:refs/remotes/upstream/pr/*`
* 配置好之后, `git fetch upstream`
* 在github上找到你想要review的PR的编号, 如果是3, 就在本地, `git checkout pr/3`, 然后就可以看到改动之后的代码了

### Log与Reflog
* `git log`用来查询repo的版本变动情况. 如果有需要的话, 可以通过commit ref来恢复
* 建议使用`git log --oneline --decorate --graph`作为查询命令
* `git reflog`用来查询本地的操作历史. 确切一点说, 是查询HEAD的变化情况. 每一次HEAD变动, 都会记录在reflog里

### 版本控制
* 撤销文件修改
    * 如果没有add, 则`git checkout -- [fileName]` (注意checkout之后的两个横线--)
    * 如果文件已经add, 则`git reset [fileName]`
    * 如果文件已经commit, 则`git reset --hard HEAD^`或`git reset --mixed HEAD^`或`git reset --soft HEAD^`
        * `--hard`表示**完全**回退到上一个版本, 回退的区域包括Working Directory, Stage Area, Commit History. (这时`git status`会显示**没有更改**)
        * `--mixed`表示**部分**回退到上一个版本, 回退的区域包括Stage Area和Commit History. (即回退到`git add`执行之前, 这时`git status`会显示文件**有更改**)
        * `--soft`表示**部分**回退到上一个版本, 回退的区域仅为Commit History. (即回退到`git add`执行之后, 即`git commit`执行之前, 这时`git status`会显示**没有更改**, 但由于存在`uncommitted changes`, 因此不能执行切换branch之类的操作)
        
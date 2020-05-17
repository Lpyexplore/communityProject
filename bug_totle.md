# 记录项目中遇到的bug以及解决方案

- 个人中心的'我的收藏'新建的文件夹  无法点击进去
```
解决办法： 重新对刷新过后的页面进行一次事件绑定
```

- 点击取消收藏按钮，有的时候会触发好几次，但有时候又不会触发多次
```
解决办法：在会重复执行的事件绑定语句前加上一句 元素.unbind('click')  取消一下上一次绑定的事件，即可避免点击事件多次触发的bug
```

- 在创建多个mongodb数据库后，会报错
```
解决办法： 在连接多个数据库时,不要用默认的connect, 要用createConnection
```


    
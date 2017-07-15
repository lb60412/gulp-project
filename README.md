# project structure
```
├── dist                      //打包处理后的代码，用于项目发布
├── src                       //开发阶段源码
│   ├── images                //图片存放目录
│   │   └── icon-p1.png
│   ├── index.html            //项目主页
│   ├── js
│   │   ├── index.js          //主入口js
│   │   └── lib
│   │       └── zepto.js      //外部依赖的js库
│   ├── sass
│   │   ├── icon.scss         //雪碧图产生的样式
│   │   └── index.scss        //主样式表
│   └── sprite                //雪碧图主目录，可以有多个子目录
│       └── p1                //雪碧图主子目录
├── .eslintrc
├── .gitignore
├── gulpfile.babel.js         //gulp配置
├── package.json				
├── README.md                 //项目介绍
└── webpack.config.js         //webpack配置	
```

# project initial
- nodejs version 7.5
- install

```
$ sudo npm install gulp -g
$ sudo npm install
```	

# project develop
	$ sudo gulp
	
# project publish
	$ sudo gulp publish

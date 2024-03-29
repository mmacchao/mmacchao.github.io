# 内置类型操作函数
- Awaited\<Type\> // 获取promise的返回值类型
- Partial\<Type\> // 将所有属性设置可选
- Required\<Type\> // 所有属性必选
- Readonly\<Type\> // 只读
- Record\<Keys, Type\> // 构建复杂对象类型
- Pick\<Type, Keys\> // 保留指定属性
- Omit\<Type, Keys\> // 删除指定属性
- Exclude\<UnionType, ExcludedMembers\> // 移除指定的类型
- Extract\<Type, Union\> // 与exclude相反 保留指定的
- NonNullable\<Type\> // 删除null和undefined
- Parameters\<Type\> // 从函数类型的参数中获取元组类型
- ConstructorParameters\<Type\> // 从构造函数的参数中获取元组类型
- ReturnType\<Type\> // 获取函数的返回类型
- InstanceType\<Type\> // 从构造函数的实例获取类型
- ThisParameterType\<Type\> // 提取函数里面this参数的类型
- OmitThisParameter\<Type\> // 返回一个新的函数类型，不包含this参数
- ThisType\<Type\> // 标识函数内部this的指向
- Uppercase\<StringType\> // 大写
- Lowercase\<StringType\> // 小写
- Capitalize\<StringType\> // 首字母大写
- Uncapitalize\<StringType\> // 首字母小写

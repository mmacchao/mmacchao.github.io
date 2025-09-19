-- xueqiu.user_message definition

CREATE TABLE `user_message` (
                              `messageId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息id',
                              `message` text COLLATE utf8mb4_unicode_ci COMMENT '消息主体',
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `origin_json` json DEFAULT NULL COMMENT '原始消息',
                              `create_at` datetime DEFAULT NULL COMMENT '消息本身的时间',
                              `create_time` datetime DEFAULT NULL COMMENT '本记录存到数据库的时间',
                              `user_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户id',
                              `user_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

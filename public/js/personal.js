
$(function () {
    /* -------------------------  个人中心的导航栏js  -----------------------  */
    const $each_bar = $('.top-bar span')
    const $content = $('.content').children()
    $content.eq(0).show().siblings().hide()
    //监听个人中心导航栏的点击
    $each_bar.click(function () {
        $(this).addClass('active').siblings().removeClass('active')
        $content.eq($(this).index()).show().siblings().hide()
    })
    /* --------------------------------------------------------------------  */

    /* ---------------------------  个人信息页面js ----------------------------*/
    const $gender = $('.gender-span')
    const $intro = $('.intro-span')
    //判断性别
    switch (parseInt($gender.html())) {
        case -1:
            $gender.html('保密')
            break
        case 0:
            $gender.html('男')
            break
        case 1:
            $gender.html('女')
    }
    //判断简介内容是否为空
    if(!$intro.html()) {
        $intro.html('无')
    }


    /* --------------------------------------------------------------------  */

    /* ---------------------------  我的收藏页面js ----------------------------*/

    let $dir_name = $('.dir-name')
    let $in_dir = $('.in-dir')
    const $dir_list =$('.dir-list')
    const $dir = $('.dir')
    const $detail_dir = $('.detail-dir')
    $detail_dir.hide()

    //监听收藏的文件夹的点击和进入收藏文件夹中的右箭头点击
    function dir_click() {
        $dir_name.each(function (index) {
            $(this).unbind('click')
            $(this).click(function () {
                $dir.hide()
                $dir_list.hide()
                $detail_dir.children().filter('input').prop({'value': $(this).children().html()})
                const $formdata = 'dir_name=' + $(this).children().html()
                $.ajax({
                    url: '/getThisDir',
                    type: 'get',
                    dataType: 'json',
                    data: $formdata,
                    success: function (data) {
                        if(data.status === 500) {
                            window.alert('服务器繁忙，请稍后重试')
                        }
                        else if(data.status === 1) {

                            $detail_dir.fadeIn(900, 'swing')
                            const $info_name = $('.info-name')
                            $info_name.children().html($(this).children().html())
                            const $items_count = $('.items-count')
                            let $items_count_num = data.TopicsInfo.length
                            $items_count.html( $items_count_num + '条内容')
                            let $li = $('.dir-items-each-li')
                            const $no_any_topic = $('.no-any-topic')
                            $no_any_topic.hide()
                            $li.show()
                            if(data.TopicsInfo.length === 0) {
                                $no_any_topic.show()
                                $li.hide()
                            }
                            else {
                                if($li.length > 1) {
                                    for(let i=0; i<$li.length - 1; i++) {
                                        $li.eq(i).remove()
                                    }
                                }
                                $li = $('.dir-items-each-li')
                                for(let i=1; i < data.TopicsInfo.length; i++) {
                                    $li.after($li.clone())
                                }
                                $li = $('.dir-items-each-li')
                                $li.each(function (i) {
                                    $(this).children().eq(3).prop({'value': data.TopicsInfo[i]._id})
                                    $(this).children().eq(0).children().eq(0).html(data.TopicsInfo[i].type)
                                    $(this).children().eq(2).children().eq(0).html(data.TopicsInfo[i].author_name).next().next().html(data.TopicsInfo[i].publish_time)
                                    //对简介内容进行切割处理
                                    const $topic_intro_width = $('.topic-intro').outerWidth()

                                    let content_string = ''
                                    for(let s of data.TopicsInfo[i].content) {
                                        if(14 * content_string.length <= 3 * $topic_intro_width - 200) {
                                            content_string += s
                                        }
                                        else {
                                            content_string += '...'

                                            return $(this).children().eq(1).children().eq(1).html(content_string)
                                        }
                                    }
                                    $(this).children().eq(1).children().eq(1).html(content_string)
                                    //对标题进行切割
                                    let title_string = ''
                                    for(let t of data.TopicsInfo[i].title) {
                                        if(16 * title_string.length <=  $topic_intro_width - 180) {
                                            title_string += t
                                        }
                                        else {
                                            title_string += '...'

                                            return $(this).children().eq(0).children().eq(1).children().html(title_string).prop({'href': '/topicdetail?id=' + data.TopicsInfo[i]._id, target: "_blank"})
                                        }
                                    }
                                    $(this).children().eq(0).children().eq(1).children().html(title_string).prop({'href': '/topicdetail?id=' + data.TopicsInfo[i]._id, target: "_blank"})

                                })

                                //初始化一下一下每个文章的取消收藏按钮
                                let $remove_my_collect_topic = $('.no-collect')
                                //处理每一个文章的取消收藏点击按钮
                                $remove_my_collect_topic.each(function (i) {
                                    $(this).unbind('click')
                                    $(this).click(function () {

                                        const $this_id = $(this).parent().next().next().next().prop('value')
                                        let $formdata = 'id=' + $this_id
                                        $.ajax({
                                            url: '/removeCollection',
                                            type: 'get',
                                            dataType: 'json',
                                            data: $formdata,
                                            success: function (data) {
                                                if(data.status === 500) {
                                                    window.alert('服务器繁忙，请稍后重试')
                                                }
                                                else if(data.status === -1) {
                                                    window.alert('请先登录账户')
                                                }
                                                else if(data.status === 0) {
                                                    window.alert('取消收藏失败,未查询到相关文章信息')
                                                }
                                                else if(data.status === 1) {
                                                    window.alert('取消收藏成功')

                                                    //移除被取消收藏的话题
                                                    $li = $('.dir-items-each-li')
                                                    $li.each(function (i) {
                                                        if($(this).children().eq(3).prop('value') === $this_id && $li.length !== 1) {
                                                            $(this).remove()
                                                        }
                                                        else if($(this).children().eq(3).prop('value') === $this_id && $li.length === 1) {
                                                            $(this).hide()
                                                            $no_any_topic.show()
                                                        }
                                                    })

                                                    //更新文件夹中收藏的话题文章数量
                                                    $items_count_num --
                                                    $items_count.html( $items_count_num + '条内容')
                                                    const $content_count = $('.content-count')
                                                    $content_count.eq(index).children().html($items_count_num + '条内容')
                                                }
                                            }
                                        })
                                    })
                                })
                            }


                        }
                    }
                })
            })
        })
        $in_dir.each(function (index) {
            $(this).unbind('click')
            $(this).click(function () {
                $dir.hide()
                $dir_list.hide()
                $detail_dir.children().filter('input').prop({'value': $(this).prev().prev().children().html()})
                const $formdata = 'dir_name=' + $(this).prev().prev().children().html()
                $.ajax({
                    url: '/getThisDir',
                    type: 'get',
                    dataType: 'json',
                    data: $formdata,
                    success: function (data) {
                        if(data.status === 500) {
                            window.alert('服务器繁忙，请稍后重试')
                        }
                        else if(data.status === 1) {

                            $detail_dir.fadeIn(900, 'swing')
                            const $info_name = $('.info-name')
                            $info_name.children().html($(this).prev().prev().children().html())
                            const $items_count = $('.items-count')
                            let $items_count_num = data.TopicsInfo.length
                            $items_count.html( $items_count_num + '条内容')
                            let $li = $('.dir-items-each-li')
                            const $no_any_topic = $('.no-any-topic')
                            $no_any_topic.hide()
                            $li.show()
                            if(data.TopicsInfo.length === 0) {
                                $no_any_topic.show()
                                $li.hide()
                            }
                            else {
                                if($li.length > 1) {
                                    for(let i=0; i<$li.length - 1; i++) {
                                        $li.eq(i).remove()
                                    }
                                }
                                $li = $('.dir-items-each-li')
                                for(let i=1; i < data.TopicsInfo.length; i++) {
                                    $li.after($li.clone())
                                }
                                $li = $('.dir-items-each-li')
                                $li.each(function (i) {
                                    $(this).children().eq(3).prop({'value': data.TopicsInfo[i]._id})
                                    $(this).children().eq(0).children().eq(0).html(data.TopicsInfo[i].type)
                                    $(this).children().eq(2).children().eq(0).html(data.TopicsInfo[i].author_name).next().next().html(data.TopicsInfo[i].publish_time)
                                    //对简介内容进行切割处理
                                    const $topic_intro_width = $('.topic-intro').outerWidth()

                                    let content_string = ''
                                    for(let s of data.TopicsInfo[i].content) {
                                        if(14 * content_string.length <= 3 * $topic_intro_width - 200) {
                                            content_string += s
                                        }
                                        else {
                                            content_string += '...'

                                            return $(this).children().eq(1).children().eq(1).html(content_string)
                                        }
                                    }
                                    $(this).children().eq(1).children().eq(1).html(content_string)
                                    //对标题进行切割
                                    let title_string = ''
                                    for(let t of data.TopicsInfo[i].title) {
                                        if(16 * title_string.length <=  $topic_intro_width - 180) {
                                            title_string += t
                                        }
                                        else {
                                            title_string += '...'

                                            return $(this).children().eq(0).children().eq(1).children().html(title_string).prop({'href': '/topicdetail?id=' + data.TopicsInfo[i]._id, target: "_blank"})
                                        }
                                    }
                                    $(this).children().eq(0).children().eq(1).children().html(title_string).prop({'href': '/topicdetail?id=' + data.TopicsInfo[i]._id, target: "_blank"})

                                })

                                //初始化一下一下每个文章的取消收藏按钮
                                let $remove_my_collect_topic = $('.no-collect')
                                //处理每一个文章的取消收藏点击按钮
                                $remove_my_collect_topic.each(function (i) {
                                    $(this).unbind('click')
                                    $(this).click(function () {
                                        const $this_id = $(this).parent().next().next().next().prop('value')
                                        let $formdata = 'id=' + $this_id
                                        $.ajax({
                                            url: '/removeCollection',
                                            type: 'get',
                                            dataType: 'json',
                                            data: $formdata,
                                            success: function (data) {
                                                if(data.status === 500) {
                                                    window.alert('服务器繁忙，请稍后重试')
                                                }
                                                else if(data.status === -1) {
                                                    window.alert('请先登录账户')
                                                }
                                                else if(data.status === 0) {
                                                    window.alert('取消收藏失败,未查询到相关文章信息')
                                                }
                                                else if(data.status === 1) {
                                                    window.alert('取消收藏成功')
                                                    //移除被取消收藏的话题
                                                    $li = $('.dir-items-each-li')
                                                    $li.each(function (i) {
                                                        if($(this).children().eq(3).prop('value') === $this_id && $li.length !== 1) {
                                                            $(this).remove()
                                                        }
                                                        else if($(this).children().eq(3).prop('value') === $this_id && $li.length === 1) {
                                                            $(this).hide()
                                                            $no_any_topic.show()
                                                        }
                                                    })
                                                    //更新文件夹中收藏的话题文章数量
                                                    $items_count_num --
                                                    $items_count.html( $items_count_num + '条内容')
                                                    const $content_count = $('.content-count')
                                                    $content_count.eq(index).children().html($items_count_num + '条内容')
                                                }
                                            }
                                        })
                                    })
                                })
                            }


                        }
                    }
                })
            })
        })
    }

    dir_click()


    //监听返回收藏话题文件夹目录按钮的点击
    const $back_to_dir_list = $('.back-to-dirlist div')
    $back_to_dir_list.click(function () {
        $detail_dir.hide()
        $dir.fadeIn(900, 'swing')
        $dir_list.fadeIn(900, 'swing')
    })


    const $new_dir = $('.new-dir')
    const $new_dir_alert = $('.new-dir-alert')
    $new_dir_alert.hide()
    //监听新建文件夹按钮的点击
    $new_dir.click(function () {
        $new_dir_alert.show()
    })
    //监听新建文件夹弹窗的关闭
    const $new_dir_alert_bg = $('.new-dir-alert .bg')
    $new_dir_alert_bg.click(function () {
        $new_dir_alert.hide()
    })
    const $new_dir_alert_no = $('.new-dir-alert .no')
    $new_dir_alert_no.click(function () {
        $new_dir_alert.hide()
    })

    const $new_dir_alert_content_value = $('.new-dir-alert .form-group input')
    const $new_dir_alert_content_sure = $('.new-dir-alert .sure')
    //确认创建文件夹的点击
    $new_dir_alert_content_sure.click(function () {
        let value = $new_dir_alert_content_value.prop('value')
        const $formdada = 'dir_name=' + value
        $.ajax({
            url: '/creatNewDir',
            type: 'get',
            dataType: 'json',
            data: $formdada
        }).done(function (data) {
            if(data.status === 500) {
                window.alert('服务器繁忙，请稍后重试')
            }
            else if(data.status === -1) {
                window.alert('账户已退出登录，请先登录账户')
                window.location.href = '/login'
            }
            else if(data.status === 0) {
                window.alert('新建文件夹失败，请重新尝试')
            }
            else if(data.status === 2) {
                window.alert('文件夹名字已存在，请重新命名')
            }
            else if(data.status === 1) {
                window.alert('创建文件夹成功')
                let $dir_li_list = $('.dir-li-list')
                //克隆一个li
                $dir_li_list.eq($dir_li_list.length-1).after($dir_li_list.eq(0).clone())
                //将新建文件夹信息传入刚克隆的li里面
                $dir_li_list = $('.dir-li-list')
                $dir_li_list.eq($dir_li_list.length-1).children().eq(0).children().html(data.data.dir_name)
                $dir_li_list.eq($dir_li_list.length-1).children().eq(1).children().html(data.data.topics_list.length + '条内容')

                //关闭新建文件夹弹窗
                $new_dir_alert.hide()

                //解决新建文件夹无法点击进入的问题
                $dir_name = $('.dir-name')
                $in_dir = $('.in-dir')
                dir_click()

            }
        })

    })

    //监听删除收藏文件夹的提醒框的关闭点击
    const $has_del_dir = $('.has-del-dir')
    $has_del_dir.hide()
    const $has_del_dir_bg = $('.has-del-dir .bg')
    $has_del_dir_bg.click(function () {
        $has_del_dir.hide()
    })
    const $has_del_dir_no = $('.has-del-dir .no')
    $has_del_dir_no.click(function () {
        $has_del_dir.hide()
    })
    const $dir_del = $('.info-items .del')
    const $has_del_dir_sure = $('.has-del-dir .sure')
    //监听文件夹的删除按钮点击
    $dir_del.click(function () {
        $has_del_dir.show()
        $has_del_dir_sure.click(function () {
            const $formdata = 'dir_name=' + $detail_dir.children().filter('input').prop('value')
            $.ajax({
                url: '/delMyDir',
                type: 'get',
                dataType: 'json',
                data: $formdata
            }).done(function (data) {
                if(data.status === 500) {
                    window.alert('服务器繁忙，请稍后重试')
                }
                else if(data.status === -1) {
                    window.alert('请先登录账号')
                }
                else if(data.status === 1 ) {
                    window.alert('文件夹删除成功')
                    $has_del_dir.hide()
                    $detail_dir.hide()
                    $dir_name = $('.dir-name')
                    //更新删除后文件夹的文件夹列表页
                    for(let i=0; i<$dir_name.length; i++) {
                        if($dir_name.eq(i).children().html() === $detail_dir.children().filter('input').prop('value')) {
                            $dir_name.eq(i).parent().remove()
                        }
                    }
                    $dir.show()
                    $dir_list.show()

                }
            })
        })


    })


    /* --------------------------------------------------------------------  */





})
multiselect
===========

多选jquery ui widget，支持多级，比如选择多个城市。<br />
用法:<br />
html:
<pre>
&lt;select&nbsp;title=&quot;最多选择5个期望工作地点&quot;&nbsp;size=&quot;5&quot;&nbsp;multiple=&quot;multiple&quot;&nbsp;id=&quot;regions&quot;&gt;
&lt;option&nbsp;value=&quot;58&quot;&gt;北京市&lt;/option&gt;
&lt;option&nbsp;value=&quot;75&quot;&gt;天津市&lt;/option&gt;
&lt;option&nbsp;value=&quot;92&quot;&gt;河北省&lt;/option&gt;
&lt;option&nbsp;value=&quot;276&quot;&gt;山西省&lt;/option&gt;
&lt;option&nbsp;value=&quot;407&quot;&gt;内蒙古&lt;/option&gt;
&lt;option&nbsp;value=&quot;521&quot;&gt;辽宁省&lt;/option&gt;
&lt;option&nbsp;value=&quot;636&quot;&gt;吉林省&lt;/option&gt;
&lt;option&nbsp;value=&quot;706&quot;&gt;黑龙江省&lt;/option&gt;
&lt;option&nbsp;value=&quot;852&quot;&gt;上海市&lt;/option&gt;
&lt;option&nbsp;value=&quot;870&quot;&gt;江苏省&lt;/option&gt;
&lt;option&nbsp;value=&quot;990&quot;&gt;浙江省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1092&quot;&gt;安徽省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1214&quot;&gt;福建省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1309&quot;&gt;江西省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1420&quot;&gt;山东省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1578&quot;&gt;河南省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1766&quot;&gt;湖北省&lt;/option&gt;
&lt;option&nbsp;value=&quot;1937&quot;&gt;湖南省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2074&quot;&gt;广东省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2263&quot;&gt;广西&lt;/option&gt;
&lt;option&nbsp;value=&quot;2387&quot;&gt;海南省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2427&quot;&gt;重庆市&lt;/option&gt;
&lt;option&nbsp;value=&quot;2466&quot;&gt;四川省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2669&quot;&gt;贵州省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2767&quot;&gt;云南省&lt;/option&gt;
&lt;option&nbsp;value=&quot;2913&quot;&gt;西藏&lt;/option&gt;
&lt;option&nbsp;value=&quot;2994&quot;&gt;陕西省&lt;/option&gt;
&lt;option&nbsp;value=&quot;3112&quot;&gt;甘肃省&lt;/option&gt;
&lt;option&nbsp;value=&quot;3216&quot;&gt;青海省&lt;/option&gt;
&lt;option&nbsp;value=&quot;3268&quot;&gt;宁夏&lt;/option&gt;
&lt;option&nbsp;value=&quot;3296&quot;&gt;新疆&lt;/option&gt;
&lt;option&nbsp;value=&quot;3410&quot;&gt;台湾省&lt;/option&gt;
&lt;option&nbsp;value=&quot;3792&quot;&gt;香港&lt;/option&gt;
&lt;option&nbsp;value=&quot;3814&quot;&gt;澳门&lt;/option&gt;&lt;/select&gt;
</pre>

js:
<pre>

$("#resume_job_target_region_ids").multiselect({

            uncheckAllText: "清空",
            noneSelectedText: "选择地区",
            selected_dict: ["278"],
            max_selected: 5,
            mark_hash: region_dict

        });
</pre>
参数：<br />
selected_dict: 默认选中的值 <br />
max_selected: 最大可以选择的数量（还没有实现) <br />
mark_hash: jason对象,hash表 举例: {"2466":{"mark_type":2,"children":["12","31"],"parent":0,"title":"四川省"}} 以后改为js直接读取结构  <br />
mark_type: 0(最后一级,叶子节点） 1(倒数第二级,点击它会弹出对话框) 2(其他级别,点击进入下一级)  <br />


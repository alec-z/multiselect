/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget 1.14pre
 * Copyright (c) 2012 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function ($, undefined) {

    var multiselectID = 0;
    var $doc = $(document);

    $.widget("ech.multiselect", {

        // default options
        options:{
            header:true,
            height:175,
            minWidth:225,
            classes:'',
            checkAllText:'Check all',
            uncheckAllText:'Uncheck all',
            noneSelectedText:'Select options',
            selectedText:'# selected',
            selectedList:0,
            show:null,
            hide:null,
            autoOpen:false,
            multiple:true,
            position:{},
            selected_dict:[]
        },
        _create_blank_menu:function (num) {
            var o = this.options;
            var menu = (this.menu[num] = $('<div />'))
                    .addClass('ui-multiselect-menu ui-widget ui-widget-content ui-corner-all')
                    .addClass(o.classes)
                    .appendTo(this.menu_scope),

                header = (this.header = $('<div />'))
                    .addClass('ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix')
                    .appendTo(menu),

                headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
                    .addClass('ui-helper-reset')
                    .html(function () {
                        if (o.header === true) {
                            return '<li><a class="ui-multiselect-all command" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none command" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
                        } else if (typeof o.header === "string") {
                            return '<li>' + o.header + '</li>';
                        } else {
                            return '';
                        }
                    })
                    .append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close command"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
                    .appendTo(header);

                 $('<div />')
                    .addClass('ui-multiselect-selected')

                    .appendTo(header)

        },
        _create_remove_link:function(){
          var title,value, i,html="";
          var res = [];
          for (i=0;i<this.selected_dict.length;i++)
          {
              value = this.selected_dict[i];
              title = this.mark_hash[value].title;
              html += "<a class='remove'"+" value='"+value+"' >"+title+"×"+"</a>";
              res.push(title);
          }
          if (this.last_main_menu!= undefined)
            this.last_main_menu.find(".ui-multiselect-header").find("div").html(html);
          return res.join(", ");
        },
        _create:function () {
            var el = this.element.hide();

            var o = this.options;

            this.speed = $.fx.speeds._default; // default speed for effects
            this._isOpen = false; // assume no
            this.element_name = this.element.attr("name");
            this.element.removeAttr("name");
            this.mark_hash = this.options.mark_hash;
            this.selected_dict = this.options.selected_dict;
            this.multiple = this.options.multiple;
            this.menu = {};
            this.inputs = ($(""));
            // create a unique namespace for events that the widget
            // factory cannot unbind automatically. Use eventNamespace if on
            // jQuery UI 1.9+, and otherwise fallback to a custom string.
            this._namespaceID = this.eventNamespace || ('multiselect' + multiselectID);
            this._ele_id = el.attr('id') || multiselectID;
            var button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>'))
                    .addClass('ui-multiselect ui-widget ui-state-default ui-corner-all')
                    .addClass(o.classes)
                    .attr({ 'title':el.attr('title'), 'aria-haspopup':true, 'tabIndex':el.attr('tabIndex') })
                    .insertAfter(el),

                buttonlabel = (this.buttonlabel = $('<span />'))
                    .html(o.noneSelectedText)
                    .appendTo(button),
                menu_scope = (this.menu_scope = $('<div />'))
                    .appendTo(document.body)


            this._create_blank_menu(0)
            this.last_main_menu = this.menu[0];
            // perform event bindings
            this._bindEvents();

            // build menu
            this.refresh(true);

            // some addl. logic for single selects
            if (!o.multiple) {
                this.menu[0].addClass('ui-multiselect-single');
            }

            this.element.find("option:selected").attr("selected",false);
            // bump unique ID
            multiselectID++;
        },

        _init:function () {
            if (this.options.header === false) {
                this.header.hide();
            }
            if (!this.options.multiple) {
                this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
            }
            if (this.options.autoOpen) {
                this.open();
            }
            if (this.element.is(':disabled')) {
                this.disable();
            }
        },
        _trans:function (dict_array, dict_id) {
            var html = "";
            var val;
            var title;
            var labelClasses = [ 'ui-corner-all' ];
            var isSelected;
            var multiselect_id = 'multiselect-' + this._ele_id;
            var operator_id;
            var self = this;
            var i;
            for (i = 0; i < dict_array.length; i++) {

                title = dict_array[i][1];
                val = dict_array[i][0];
                isSelected = false;
                operator_id = multiselect_id + "_" + dict_id + "_" + i;
                if ($.inArray(val, this.selected_dict) != -1) {
                    isSelected = true;
                }

                html += '<label for="' + operator_id + '" class="' + labelClasses.join(' ') + '">';
                if (this.mark_hash[val].mark_type == 0) {
                    html += '<input id="' + operator_id + '" name="' + multiselect_id + '" type="' + (self.multiple ? "checkbox" : "radio") + '" value="' + val + '" title="' + title + '"';
                    // pre-selected?
                    if (isSelected) {
                        html += ' checked="checked"';
                        html += ' aria-selected="true"';
                    }
                    html += ' /><span>' + title + '</span>';

                }
                else if (this.mark_hash[val].mark_type == 1) {
                    html += '<a id="' + operator_id + '" value="' + val + '" class="popup">' + title + "</a>";
                }
                else {
                    html += '<a id="' + operator_id + '" value="' + val + '" class="change">' + title + "</a>";
                }
                html += "</label>";


            }
            $(html).appendTo(this.menu[dict_id]);
            this.inputs = this.menu_scope.find("input");
            this.labels = this.menu_scope.find("label");


        },

        refresh:function (init) {
            var dict_array = [];
            this.element.find("option").each(function () {
                dict_array.push([this.value, this.innerHTML]);
            })


            this._trans(dict_array, 0)

            // cache some moar useful elements
            //
            //this.labels = menu.find('label');


            // set widths
            this._setButtonWidth();
            this._setMenuWidth();

            // remember default value
            this.button[0].defaultValue = this.update();

            // broadcast refresh event; useful for widgets
            if (!init) {
                this._trigger('refresh');
            }
        },
        _prepare_input:function(){
           var name = this.element_name;
           var html = "";
           var i;
           var input_str = '<input type="hidden"  name="'+name+'" value="" >';
           this.element.parent().find("input").remove();
           for (i=0;i<this.selected_dict.length;i++)
           {
               html+= ' <input type="hidden"  name="'+name+'" value="'+this.selected_dict[i]+'" >'
           }
           this.element.before(html);

        },
        // updates the button text. call refresh() to rebuild
        update:function () {
            var o = this.options;
            var $inputs = this.inputs;
            var $checked = $inputs.filter(':checked');

            var value;
            var new_select = [];
            var i;
            new_select = $checked.map(function(){
                return this.value;
            }).get();

            for (i=0;i<new_select.length;i++)
            {
                if ($.inArray(new_select[i],this.selected_dict)==-1)
                    this.selected_dict.push(new_select[i]);

            }


            value = this._create_remove_link();
            if (this.selected_dict.length === 0) {
                value = o.noneSelectedText;
            }
            this._setButtonValue(value);
            this._prepare_input();
            return value;
        },

        // this exists as a separate method so that the developer
        // can easily override it.
        _setButtonValue:function (value) {
            this.buttonlabel.text(value);
        },

        // binds events
        _bindEvents:function () {
            var self = this;
            var button = this.button;

            function clickHandler() {
                self[ self._isOpen ? 'close' : 'open' ]();
                return false;
            }

            // webkit doesn't like it when you click on the span :(
            button
                .find('span')
                .bind('click.multiselect', clickHandler);

            // button events
            button.bind({
                click:clickHandler,
                keypress:function (e) {
                    switch (e.which) {
                        case 27: // esc
                        case 38: // up
                        case 37: // left
                            self.close();
                            break;
                        case 39: // right
                        case 40: // down
                            self.open();
                            break;
                    }
                },
                mouseenter:function () {
                    if (!button.hasClass('ui-state-disabled')) {
                        $(this).addClass('ui-state-hover');
                    }
                },
                mouseleave:function () {
                    $(this).removeClass('ui-state-hover');
                },
                focus:function () {
                    if (!button.hasClass('ui-state-disabled')) {
                        $(this).addClass('ui-state-focus');
                    }
                },
                blur:function () {
                    $(this).removeClass('ui-state-focus');
                }
            });

            // header links
            this.menu_scope.delegate('.ui-multiselect-header  a.command', 'click.multiselect', function (e) {
                // close link
                if ($(this).hasClass('ui-multiselect-close')) {
                    self.close();

                    // check all / uncheck all
                } else {
                    self[$(this).hasClass('ui-multiselect-all') ? 'checkAll' : 'uncheckAll']();
                }

                e.preventDefault();
            });

            // optgroup label toggle support
            this.menu_scope
                .delegate('label', 'mouseenter.multiselect', function () {
                    if (!$(this).hasClass('ui-state-disabled')) {
                        self.labels.removeClass('ui-state-hover');

                        $(this).addClass('ui-state-hover').find('input').focus();
                    }
                })
                .delegate('label', 'keydown.multiselect', function (e) {
                    e.preventDefault();

                    switch (e.which) {
                        case 9: // tab
                        case 27: // esc
                            self.close();
                            break;
                        case 38: // up
                        case 40: // down
                        case 37: // left
                        case 39: // right
                            self._traverse(e.which, this);
                            break;
                        case 13: // enter
                            $(this).find('input')[0].click();
                            break;
                    }
                })
                .delegate('a.ui-multiselect-popup-close', 'click.multiselect', function () {

                    $.fn.hide.apply($(this).parent().parent(), []);
                })
                .delegate('label a.popup', 'click.multiselect', function (e) {

                    e.preventDefault();
                    if (self.last_popup_menu != undefined) {
                        $.fn.hide.apply(self.last_popup_menu, []);
                    }
                    var val = $(this).attr("value");
                    var header;
                    if (self.menu[val] == undefined) {
                        self.menu[val] = $('<div />')
                            .addClass('ui-multiselect-popup ui-widget ui-widget-content ui-corner-all')
                            .appendTo(self.menu_scope);
                        header = $('<div />')
                            .addClass('ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix')
                            .appendTo(self.menu[val]);
                        $('<a href="#" class="ui-multiselect-popup-close"><span class="ui-icon ui-icon-circle-close"></span></a>').appendTo(header);
                        self._trans(self.mark_hash[val].children, val);
                    }

                    self.position(self.menu[val],$(this),"right");
                    self.last_popup_menu = self.menu[val];
                    $.fn.show.apply(self.menu[val], []);
                })
                .delegate('a.remove', 'click.multiselect', function (e) {
                   var val = $(this).attr("value");
                   self.inputs.filter("[value='"+val+"']").attr("checked",false);
                    self.selected_dict.splice($.inArray(val,self.selected_dict),1);
                    setTimeout($.proxy(self.update, self), 10);
                })
                .delegate('a.change', 'click.multiselect', function (e) {
                    var parent_id = 0;
                    e.preventDefault();
                    self.close();
                    if (self.last_popup_menu != undefined) {
                        $.fn.hide.apply(self.last_popup_menu, []);
                    }
                    var val = $(this).attr("value");
                    var header;
                    if (self.menu[val] == undefined) {
                        self._create_blank_menu(val)

                        self._trans(self.mark_hash[val].children, val);
                        if (self.mark_hash[val] !=undefined)
                            parent_id = self.mark_hash[val].parent;
                        if (self.mark_hash[parent_id] == undefined)
                            parent_id = 0;
                        if (val!=0)
                            $('<a class="change" value="'+parent_id+'">'+'返回上一级'+'</a>')
                                .appendTo(self.menu[val].find(".ui-multiselect-header"));
                    }

                    self._create_remove_link();
                    self.position(self.menu[val]);
                    self.last_main_menu = self.menu[val];
                    self.open();
                    self._setMenuWidth();


                })
                .delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function (e) {
                    var $this = $(this);
                    var val = this.value;
                    var checked = this.checked;


                    // bail if this input is disabled or the event is cancelled
                    if (this.disabled || self._trigger('click', e, { value:val, text:this.title, checked:checked }) === false) {
                        e.preventDefault();
                        return;
                    }

                    // make sure the input has focus. otherwise, the esc key
                    // won't close the menu after clicking an item.
                    $this.focus();

                    // toggle aria state
                    $this.attr('aria-selected', checked);



                    // some additional single select-specific logic
                    if (!self.options.multiple) {
                        self.labels.removeClass('ui-state-active');
                        $this.closest('label').toggleClass('ui-state-active', checked);
                        self.selected_dict = [];

                        if (self.last_popup_menu != undefined) {
                            $.fn.hide.apply(self.last_popup_menu, []);
                        }
                        // close menu
                        self.close();
                    }

                    // fire change on the select box
                    if (!$this.is(":checked"))
                    {
                        self.selected_dict.splice($.inArray(val,self.selected_dict),1);
                    }

                    // setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
                    // http://bugs.jquery.com/ticket/3827
                    setTimeout($.proxy(self.update, self), 10);
                });

            // close each widget when clicking on any other element/anywhere else on the page
            $doc.bind('mousedown.' + this._namespaceID, function (e) {
                if (self.last_popup_menu != undefined && self.last_popup_menu.is(":visible")) {
                    if (!$.contains(self.last_popup_menu[0], e.target) && self.last_popup_menu[0] != e.target) {
                        $.fn.hide.apply(self.last_popup_menu, []);
                        return false;
                    }
                }
                else if (self._isOpen && !$.contains(self.last_main_menu[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0]) {
                    self.close();
                }
            });

            // deal with form resets.  the problem here is that buttons aren't
            // restored to their defaultValue prop on form reset, and the reset
            // handler fires before the form is actually reset.  delaying it a bit
            // gives the form inputs time to clear.
            $(this.element[0].form).bind('reset.multiselect', function () {
                setTimeout($.proxy(self.refresh, self), 10);
            });
        },

        // set button width
        _setButtonWidth:function () {
            var width = this.element.outerWidth();
            var o = this.options;

            if (/\d/.test(o.minWidth) && width < o.minWidth) {
                width = o.minWidth;
            }

            // set widths
            this.button.outerWidth(width);
        },

        // set menu width
        _setMenuWidth:function () {
            var m = this.last_main_menu;
            var width = parseInt(this.button.outerWidth()*2.5);
            m.outerWidth(width);
            m.find("label").outerWidth(parseInt(width / 3)-5);
        },

        // move up or down within the menu
        _traverse:function (which, start) {
            var $start = $(start);
            var moveToLast = which === 38 || which === 37;

            // select the first li that isn't an optgroup label / disabled
            $next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[ moveToLast ? 'last' : 'first']();

            // if at the first/last element
            if (!$next.length) {
                var $container = this.menu[0].find('ul').last();

                // move to the first/last
                this.menu.find('label')[ moveToLast ? 'last' : 'first' ]().trigger('mouseover');

                // set scroll position
                $container.scrollTop(moveToLast ? $container.height() : 0);

            } else {
                $next.find('label').trigger('mouseover');
            }
        },

        // This is an internal function to toggle the checked property and
        // other related attributes of a checkbox.
        //
        // The context of this function should be a checkbox; do not proxy it.
        _toggleState:function (prop, flag) {
            return function () {
                if (!this.disabled) {
                    this[ prop ] = flag;
                }

                if (flag) {
                    this.setAttribute('aria-selected', true);
                } else {
                    this.removeAttribute('aria-selected');
                }
            };
        },

        _toggleChecked:function (flag, group) {
            var $inputs = (group && group.length) ? group : this.inputs;
            var self = this;

            // toggle state on inputs
            $inputs.each(this._toggleState('checked', flag));

            // give the first input focus
            $inputs.eq(0).focus();
            if (flag==false)
            {
                this.selected_dict = []
            }
            // update button text
            this.update();

            // gather an array of the values that actually changed
            var values = $inputs.map(function () {
                return this.value;
            }).get();

            // toggle state on original option tags
            this.element
                .find('option')
                .each(function () {
                    if (!this.disabled && $.inArray(this.value, values) > -1) {
                        self._toggleState('selected', flag).call(this);
                    }
                });

            // trigger the change event on the select
            if ($inputs.length) {
                this.element.trigger("change");
            }
        },

        _toggleDisabled:function (flag) {
            this.button.attr({ 'disabled':flag, 'aria-disabled':flag })[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');

            var inputs = this.menu_scope.find('input');
            var key = "ech-multiselect-disabled";

            if (flag) {
                // remember which elements this widget disabled (not pre-disabled)
                // elements, so that they can be restored if the widget is re-enabled.
                inputs = inputs.filter(':enabled').data(key, true)
            } else {
                inputs = inputs.filter(function () {
                    return $.data(this, key) === true;
                }).removeData(key);
            }

            inputs
                .attr({ 'disabled':flag, 'arial-disabled':flag })
                .parent()[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');

            this.element.attr({
                'disabled':flag,
                'aria-disabled':flag
            });
        },

        // open the menu
        open:function (e) {
            var self = this;
            var button = this.button;
            var menu = this.last_main_menu;
            var speed = this.speed;
            var o = this.options;
            var args = [];

            // bail if the multiselectopen event returns false, this widget is disabled, or is already open
            if (this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen) {
                return;
            }

            var $container = menu.find('div').last();
            var effect = o.show;

            // figure out opening effects/speeds
            if ($.isArray(o.show)) {
                effect = o.show[0];
                speed = o.show[1] || self.speed;
            }

            // if there's an effect, assume jQuery UI is in use
            // build the arguments to pass to show()
            if (effect) {
                args = [ effect, speed ];
            }

            // set the scroll of the checkbox container
            //$container.scrollTop(0).height(o.height);

            // positon
            this.position();

            // show the menu, maybe with a speed/effect combo
            $.fn.show.apply(menu, args);

            // select the first option
            // triggering both mouseover and mouseover because 1.4.2+ has a bug where triggering mouseover
            // will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
            this.labels.eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');

            button.addClass('ui-state-active');
            this._isOpen = true;
            this._trigger('open');
        },

        // close the menu
        close:function () {
            if (this._trigger('beforeclose') === false) {
                return;
            }

            var o = this.options;
            var effect = o.hide;
            var speed = this.speed;
            var args = [];

            // figure out opening effects/speeds
            if ($.isArray(o.hide)) {
                effect = o.hide[0];
                speed = o.hide[1] || this.speed;
            }

            if (effect) {
                args = [ effect, speed ];
            }

            $.fn.hide.apply(this.last_main_menu, args);
            this.button.removeClass('ui-state-active').trigger('blur').trigger('mouseleave');
            this._isOpen = false;
            this._trigger('close');
        },

        enable:function () {
            this._toggleDisabled(false);
        },

        disable:function () {
            this._toggleDisabled(true);
        },

        checkAll:function (e) {
            this._toggleChecked(true);
            this._trigger('checkAll');
        },

        uncheckAll:function () {
            this._toggleChecked(false);
            this._trigger('uncheckAll');
        },

        getChecked:function () {
            return this.menu.find('input').filter(':checked');
        },

        destroy:function () {
            // remove classes + data
            $.Widget.prototype.destroy.call(this);

            // unbind events
            $doc.unbind(this._namespaceID);

            this.button.remove();
            this.last_main_menu.remove();
            this.element.show();

            return this;
        },

        isOpen:function () {
            return this._isOpen;
        },

        widget:function () {
            return this.last_main_menu;
        },

        getButton:function () {
            return this.button;
        },

        position:function (obj,locate,direction) {
            var o = this.options;
            var sub,pos;
            if (obj != undefined)
                sub = obj;
            else
                sub = this.last_main_menu;
            // use the position utility if it exists and options are specifified
            if (locate == undefined)
            {
               locate = this.button;

            }

                pos = locate.offset();

            if  (direction == undefined)
            sub.css({
                top:pos.top + locate.outerHeight(),
                left:pos.left
            });
            else
                sub.css({
                    top:pos.top-parseInt(obj.outerHeight() / 4  ) ,
                    left:pos.left+locate.outerWidth()
                });

        },

        // react to option changes after initialization
        _setOption:function (key, value) {
            var menu = this.menu;

            switch (key) {
                case 'header':
                    menu.find('div.ui-multiselect-header')[value ? 'show' : 'hide']();
                    break;
                case 'checkAllText':
                    menu.find('a.ui-multiselect-all span').eq(-1).text(value);
                    break;
                case 'uncheckAllText':
                    menu.find('a.ui-multiselect-none span').eq(-1).text(value);
                    break;
                case 'height':
                    menu.find('ul').last().height(parseInt(value, 10));
                    break;
                case 'minWidth':
                    this.options[key] = parseInt(value, 10);
                    this._setButtonWidth();
                    this._setMenuWidth();
                    break;
                case 'selectedText':
                case 'selectedList':
                case 'noneSelectedText':
                    this.options[key] = value; // these all needs to update immediately for the update() call
                    this.update();
                    break;
                case 'classes':
                    menu.add(this.button).removeClass(this.options.classes).addClass(value);
                    break;
                case 'multiple':
                    menu.toggleClass('ui-multiselect-single', !value);
                    this.options.multiple = value;
                    this.element[0].multiple = value;
                    this.refresh();
                    break;
                case 'position':
                    this.position();
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        }
    });

})(jQuery);

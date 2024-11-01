/**
 * Wordfez plugin.
 */

(function() {
	var DOM = tinymce.DOM;

	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('wordfez');

	tinymce.create('tinymce.plugins.wordfez', {
		init : function(ed, url) {
			var t = this;
			var FRHTML = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.fr_alt_begin')+'" title="'+ed.getLang('wordfez.fr_alt_begin')+'" class="mce_plugin_wordfez_fr_begin" name="mce_plugin_wordfez_fr" />'
						+ '<p><br /></p>'
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.fr_alt_end')+'" title="'+ed.getLang('wordfez.fr_alt_end')+'" class="mce_plugin_wordfez_fr_end" name="mce_plugin_wordfez_fr" />';
			var ENHTML = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.en_alt_begin')+'" title="'+ed.getLang('wordfez.en_alt_begin')+'" class="mce_plugin_wordfez_en_begin" name="mce_plugin_wordfez_en" />'
						+ '<p><br /></p>'
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.en_alt_end')+'" title="'+ed.getLang('wordfez.en_alt_end')+'" class="mce_plugin_wordfez_en_end" name="mce_plugin_wordfez_en" />';

			// Register commands
			ed.addCommand('WP_FR', function() {
				ed.execCommand('mceInsertContent', 0, FRHTML);
			});
			
			ed.addCommand('WP_EN', function() {
				ed.execCommand('mceInsertContent', 0, ENHTML);
			});
			
			// Register buttons
			ed.addButton('wordfez_fr', {
				title : 'wordfez.fr_button',
				image : url + '/../images/frB.gif',
				cmd : 'WP_FR'
			});

			ed.addButton('wordfez_en', {
				title : 'wordfez.en_button',
				image : url + '/../images/enB.gif',
				cmd : 'WP_EN'
			});

			// Add listeners to handle more break
			t._handleENFR(ed, url);
			
			// Add custom shortcuts
			ed.addShortcut('alt+shift+f', ed.getLang('wordfez_fr'), 'WP_FR');
			ed.addShortcut('alt+shift+e', ed.getLang('wordfez_en'), 'WP_EN');

		},

		getInfo : function() {
			return {
				longname : 'Wordfez Plugin',
				author : 'Olivier Juan',
				authorurl : 'http://olive.juan.free.fr/blog/',
				infourl : 'http://olive.juan.free.fr/blog/index.php/wordfez-a-seamless-bilingual-plugin-for-wordpress-25/',
				version : '0.2'
			};
		},

		_handleENFR : function(ed, url) {
			var FRHTMLbegin = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.fr_alt_begin')+'" title="'+ed.getLang('wordfez.fr_alt_begin')+'" class="mce_plugin_wordfez_fr_begin" name="mce_plugin_wordfez_fr" />';
			var FRHTMLend = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.fr_alt_end')+'" title="'+ed.getLang('wordfez.fr_alt_end')+'" class="mce_plugin_wordfez_fr_end" name="mce_plugin_wordfez_fr" />';
			var ENHTMLbegin = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.en_alt_begin')+'" title="'+ed.getLang('wordfez.en_alt_begin')+'" class="mce_plugin_wordfez_en_begin" name="mce_plugin_wordfez_en" />';
			var ENHTMLend = ''
						+ '<img src="' + url + "/../images/trans.gif" + '" '
						+ ' width="100%" height="12px" '
						+ 'alt="'+ed.getLang('wordfez.en_alt_end')+'" title="'+ed.getLang('wordfez.en_alt_end')+'" class="mce_plugin_wordfez_en_end" name="mce_plugin_wordfez_en" />';

			// Load plugin specific CSS into editor
			ed.onInit.add(function() {
				ed.dom.loadCSS(url + '/css/content.css');
			});

			// Display morebreak instead if img in element path
			ed.onPostRender.add(function() {
				if (ed.theme.onResolveName) {
					ed.theme.onResolveName.add(function(th, o) {
						if (o.node.nodeName == 'IMG') {
              if ( ed.dom.hasClass(o.node, 'mce_plugin_wordfez_fr_begin') )
                o.name = 'wpfr';
              if ( ed.dom.hasClass(o.node, 'mce_plugin_wordfez_fr_end') )
                o.name = 'wpfr';
              if ( ed.dom.hasClass(o.node, 'mce_plugin_wordfez_en_begin') )
                o.name = 'wpen';
              if ( ed.dom.hasClass(o.node, 'mce_plugin_wordfez_en_end') )
                o.name = 'wpen';
              }
					});
				}
			});

			// Replace morebreak with images
			ed.onBeforeSetContent.add(function(ed, o) {
				o.content = o.content.replace(/<!--fr-->/g, FRHTMLbegin);
				o.content = o.content.replace(/<!--\/fr-->/g, FRHTMLend);
				o.content = o.content.replace(/<!--en-->/g, ENHTMLbegin);
				o.content = o.content.replace(/<!--\/en-->/g, ENHTMLend);
			});

			// Replace images with morebreak
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = o.content.replace(/<img[^>]+>/g, function(im) {
						if (im.indexOf('class="mce_plugin_wordfez_fr_begin') !== -1) {
              im = '<!--fr-->';
            }
            if (im.indexOf('class="mce_plugin_wordfez_fr_end') !== -1) {
							im = '<!--/fr-->';
						}
            if (im.indexOf('class="mce_plugin_wordfez_en_begin') !== -1) {
							im = '<!--en-->';
						}
            if (im.indexOf('class="mce_plugin_wordfez_en_end') !== -1) {
							im = '<!--/en-->';
						}
            return im;
					});
			});

	}
	});
	
	// Register plugin
	tinymce.PluginManager.add('wordfez', tinymce.plugins.wordfez);
})();

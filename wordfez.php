<?php
/*
Plugin Name: WordFez
Plugin URI: http://olive.juan.free.fr/blog/index.php/wordfez-a-seamless-bilingual-plugin-for-wordpress-25/
Description: WordFez is a plugin for bilingual (French-English) posts/pages. It is seamlessly integrated into Wordpress using a TinyMCE plugin.
Version: 0.2.1
Author: Olivier Juan
Author URI: http://olive.juan.free.fr/blog/
*/
/*  Copyright 2005  Olivier Juan  (email : juan@certis.enpc.fr)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

/* Changelog
	2006-01-23: first version
*/
function get_post_languages() {
	$plugin_url = get_bloginfo('url') . '/wp-content/plugins/' . plugin_basename(dirname(__FILE__)) ;
	echo '<span lang="en" class="language"><a href="javascript:language(' . "'fr','en'" . ')" title="Version Francaise" ><img src="'. $plugin_url . '/images/fr.gif' . '" alt="Francais" name="Francais" /> En Fran&ccedil;ais</a></span>';
	echo '<span lang="fr" class="language"><a href="javascript:language(' . "'en','fr'" . ')" title="English Version" ><img src="'. $plugin_url . '/images/en.gif' . '" alt="English" name="English" /> In English</a></span>' . "\n";
}
function add_language_picker() {
	$plugin_url = get_bloginfo('url') . '/wp-content/plugins/' . plugin_basename(dirname(__FILE__)) ;
	echo '<script type="text/javascript" src="' . $plugin_url . '/wordfez.js"></script>' . "\n";
	/*echo '<style type="text/css"> .language { display:none; } </style>' . "\n";*/
}
function add_language_tags($content) {
	$content = preg_replace('#(<p[^>]*>)?\\s*(<br\\s*/>\\s*)?\\s*((<!--fr-->|<!--en-->)\\s*(<!--/fr-->|<!--/en-->)?|(<!--/fr-->|<!--/en-->)\\s*(<!--fr-->|<!--en-->)?)\\s*(<br\\s*/>\\s*)?\\s*#','$3$1',$content);
	$content = preg_replace('#\\s*(<br\\s*/>\\s*)?\\s*((<!--fr-->|<!--en-->)\\s*(<!--/fr-->|<!--/en-->)?|(<!--/fr-->|<!--/en-->)\\s*(<!--fr-->|<!--en-->)?)\\s*(<br\\s*/>\\s*)?\\s*(</p>)?#','$8$2',$content);
	$content = preg_replace('#<p[^>]*>\\s*</p>#','',$content);
	$content = preg_replace('/<!--fr-->/','<span lang="fr" class="language">',$content);
	$content = preg_replace('/<!--\/fr-->/','</span>',$content);
	$content = preg_replace('/<!--en-->/','<span lang="en" class="language">',$content);
	$content = preg_replace('/<!--\/en-->/','</span>',$content);
	$content = preg_replace('/<p>[ \n\r\t]*<\/p>/','',$content);
	return $content;
}
add_action('wp_head', 'add_language_picker');
add_filter('the_content', 'add_language_tags');

// Put functions into one big function we'll call at the plugins_loaded
// action. This ensures that all required plugin functions are defined.
function widget_wordfez_init() {

	// Check for the required plugin functions. This will prevent fatal
	// errors occurring when you deactivate the dynamic-sidebar plugin.
	if ( !function_exists('register_sidebar_widget') )
		return;

	// This is the function that outputs our little Wikipedia search form.
	function widget_wordfez($args) {
		
		// $args is an array of strings that help widgets to conform to
		// the active theme: before_widget, before_title, after_widget,
		// and after_title are the array keys. Default tags: li and h2.
		extract($args);

		// Each widget can store its own options. We keep strings here.
		$options = get_option('widget_wordfez');
		$title = $options['title'];

		// These lines generate our output. Widgets can be very complex
		// but as you can see here, they can also be very, very simple.
		echo $before_widget . $before_title . $title . $after_title;
		$plugin_url = get_bloginfo('url') . '/wp-content/plugins/' . plugin_basename(dirname(__FILE__)) ;
		echo '<ul>' . "\n";
		echo '<span lang="en" class="language" style="margin-top:5px;text-align:left;"><li><a href="javascript:language(' . "'fr','en'" . ')" title="Version Francaise" ><img src="'. $plugin_url . '/images/fr.gif' . '" alt="Francais" name="Francais" /> En Fran&ccedil;ais</a></li></span>' . "\n";
		echo '<span lang="fr" class="language" style="margin-top:5px;text-align:left;"><li><a href="javascript:language(' . "'en','fr'" . ')" title="English Version" ><img src="'. $plugin_url . '/images/en.gif' . '" alt="English" name="English" /> In English</a></li></span>' . "\n";
		echo '</ul>' . "\n";
		echo $after_widget;
	}

	// This is the function that outputs the form to let the users edit
	// the widget's title. It's an optional feature that users cry for.
	function widget_wordfez_control() {

		// Get our options and see if we're handling a form submission.
		$options = get_option('widget_wordfez');
		if ( !is_array($options) )
			$options = array('title'=>'');
		if ( $_POST['wordfez-submit'] ) {

			// Remember to sanitize and format use input appropriately.
			$options['title'] = strip_tags(stripslashes($_POST['wordfez-title']));
			update_option('widget_wordfez', $options);
		}

		// Be sure you format your options to be valid HTML attributes.
		$title = htmlspecialchars($options['title'], ENT_QUOTES);
		
		// Here is our little form segment. Notice that we don't need a
		// complete form. This will be embedded into the existing form.
		echo '<p style="text-align:right;"><label for="wordfez-title">Title: <input style="width: 200px;" id="wordfez-title" name="wordfez-title" type="text" value="'.$title.'" /></label></p>';
		echo '<input type="hidden" id="wordfez-submit" name="wordfez-submit" value="1" />';
	}
	
	// This registers our widget so it appears with the other available
	// widgets and can be dragged and dropped into any active sidebars.
	register_sidebar_widget('Language Picker', 'widget_wordfez');

	// This registers our optional widget control form. Because of this
	// our widget will have a button that reveals a 300x100 pixel form.
	register_widget_control('Language Picker', 'widget_wordfez_control', 300, 100);
}

// Run our code later in case this loads prior to any required plugins.
add_action('plugins_loaded', 'widget_wordfez_init');

function wordfez_plugin_mce($array) {
	$plugin_url = get_bloginfo('url') . '/wp-content/plugins/' . plugin_basename(dirname(__FILE__)) ;
	$array['wordfez'] = $plugin_url . '/mce/wordfez_plugin.js';
	return $array;
}

function wordfez_button_mce($array) {
	$insert_array = array( '|', 'wordfez_fr', 'wordfez_en');
	$position = array_search('wp_more', $array) + 1;
	$first_array = array_splice ($array, 0, $position);
 	$array = array_merge ($first_array, $insert_array, $array);	
	return $array;
}


add_filter('mce_external_plugins', 'wordfez_plugin_mce');
add_filter('mce_buttons', 'wordfez_button_mce');


?>

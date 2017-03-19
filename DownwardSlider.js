var DownwardSlider = (function () { 'use strict';

var addedCss = false;
function addCss () {
	var style = createElement( 'style' );
	style.textContent = "\n\t[svelte-190069895].downwardslider, [svelte-190069895] .downwardslider {\n\t\tcolor: #0000FF;\n\t\ttext-decoration: underline;\n\t}\n\t[svelte-190069895].hidden, [svelte-190069895] .hidden {\n\t\tdisplay:none;\n\t}\n\t[svelte-190069895].items, [svelte-190069895] .items {\n\t\tcolor: black;\n\t\ttext-decoration: none;\n\t}\n";
	appendNode( style, document.head );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var span = createElement( 'span' );
	setAttribute( span, 'svelte-190069895', '' );
	span.className = "downwardslider";
	
	var last_text = root.title
	var text = createText( last_text );
	appendNode( text, span );
	appendNode( createText( "\n" ), span );
	
	var span1 = createElement( 'span' );
	setAttribute( span1, 'svelte-190069895', '' );
	span1.className = "items hidden";
	
	appendNode( span1, span );
	
	var ul = createElement( 'ul' );
	setAttribute( ul, 'svelte-190069895', '' );
	
	appendNode( ul, span1 );
	var eachBlock_anchor = createComment();
	appendNode( eachBlock_anchor, ul );
	var eachBlock_value = root.items;
	var eachBlock_iterations = [];
	
	for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
		eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
		eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			if ( ( __tmp = root.title ) !== last_text ) {
				text.data = last_text = __tmp;
			}
			
			var eachBlock_value = root.items;
			
			for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
				if ( !eachBlock_iterations[i] ) {
					eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
					eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
				} else {
					eachBlock_iterations[i].update( changed, root, eachBlock_value, eachBlock_value[i], i );
				}
			}
			
			teardownEach( eachBlock_iterations, true, eachBlock_value.length );
			
			eachBlock_iterations.length = eachBlock_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock_iterations, false );
			
			if ( detach ) {
				detachNode( span );
			}
		}
	};
}

function renderEachBlock ( root, eachBlock_value, item, item__index, component ) {
	var li = createElement( 'li' );
	setAttribute( li, 'svelte-190069895', '' );
	
	var a = createElement( 'a' );
	setAttribute( a, 'svelte-190069895', '' );
	var last_a_href = item.link;
	a.href = last_a_href;
	
	appendNode( a, li );
	var last_text = item.name
	var text = createText( last_text );
	appendNode( text, a );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, item, item__index ) {
			var __tmp;
		
			if ( ( __tmp = item.link ) !== last_a_href ) {
				last_a_href = __tmp;
				a.href = last_a_href;
			}
			
			if ( ( __tmp = item.name ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function DownwardSlider ( options ) {
	options = options || {};
	this._state = options.data || {};
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	if ( !addedCss ) addCss();
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

DownwardSlider.prototype.get = get;
DownwardSlider.prototype.fire = fire;
DownwardSlider.prototype.observe = observe;
DownwardSlider.prototype.on = on;
DownwardSlider.prototype.set = set;
DownwardSlider.prototype._flush = _flush;

DownwardSlider.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DownwardSlider.prototype.teardown = DownwardSlider.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createElement( name ) {
	return document.createElement( name );
}

function setAttribute( node, attribute, value ) {
	node.setAttribute ( attribute, value );
}

function detachNode( node ) {
	node.parentNode.removeChild( node );
}

function insertNode( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function createText( data ) {
	return document.createTextNode( data );
}

function appendNode( node, target ) {
	target.appendChild( node );
}

function createComment() {
	return document.createComment( '' );
}

function teardownEach( iterations, detach, start ) {
	for ( var i = ( start || 0 ); i < iterations.length; i += 1 ) {
		iterations[i].teardown( detach );
	}
}

function dispatchObservers( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

function get( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on( eventName, handler ) {
	if ( eventName === 'teardown' ) return this.on( 'destroy', handler );

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set( newState ) {
	this._set( newState );
	( this._root || this )._flush();
}

function _flush() {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		var hook = this._renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

return DownwardSlider;

}());
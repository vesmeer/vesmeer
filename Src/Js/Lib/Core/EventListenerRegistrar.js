define(["Utils/Utils"],

	function(Utils) {

		/**
		 * Manages adding and removing event listeners to and from 
		 * the document DOM element.
		 */
		function EventListenerRegistrar() {
			this._eventListeners = {};
			this._suspendedEventListeners = {};
		}

		EventListenerRegistrar.KEY = {
			'ENTER': 13,
			'e': 69,
			'f': 70,
			'g': 71,
			'h': 72,
			'i': 73,
			'l': 76,
			'o': 79,
			'q': 81,
			't': 84,
			'x': 88,
			'[': 219,
			']': 221
		}

		/**
		 * Registers the given event listener and activates it.
		 */
		EventListenerRegistrar.prototype.addListener = function(eventType, handler) {
			this._initListenerTypeCollection(eventType);
			if (this.hasListener(eventType, handler) == false) {
				this._eventListeners[eventType].push(handler);
				$(document).on(eventType, handler);
			}
		}

		EventListenerRegistrar.prototype._initListenerTypeCollection = function(eventType) {
			if (this._eventListeners.hasOwnProperty(eventType) == false) {
				this._eventListeners[eventType] = [];
			}
		}

		/**
		 * Returns event listeners of the given type.
		 */
		EventListenerRegistrar.prototype.getListeners = function(eventType) {
			return this._eventListeners[eventType];
		}

		/**
		 * Returns true if a listener of the given type and having the given 
		 * handler method associated with it is registered, false otherwise.
		 */
		EventListenerRegistrar.prototype.hasListener = function(eventType, handler) {
			return jQuery.inArray(
				handler, 
				this._eventListeners[eventType]
			) != -1;
		}

		/**
		 * Unregisters and deactivates the listener of the given eventType and
		 * handler function.
		 */
		EventListenerRegistrar.prototype.removeListener = function(eventType, handler) {
			var listeners = [];

			if (this.hasListener(eventType, handler)) {
				for(var i = 0; i < this._eventListeners[eventType].length; i++) {
					if (this._eventListeners[eventType][i] !== handler) {
						listeners.push(this._eventListeners[eventType][i]);
					}
					else {
						$(document).off(eventType, handler);
					}
				}
			}

			this._eventListeners[eventType] = listeners;
		}

		/**
		 * Temporarily disables these listeners. The listeners variable 
		 * is an array of {eventType: handler} items.
		 */
		EventListenerRegistrar.prototype.suspendListenersExcept = function(listenersToKeep) {
			this._suspendedEventListeners = Utils.deepCopy(
				this._eventListeners);
			
			for(var evtType in this._eventListeners) {
				var hdlr = this._eventListeners[evtType];
				for(var j = 0; j < hdlr.length; j++) {
					var keep = this._keepListener(
						listenersToKeep, 
						evtType, 
						hdlr[j]
					);
					if (!keep) {
						this.removeListener(evtType, hdlr[j]);
				 	}
				}
			}
		}

		/**
		 * Returns true if the given listener handler specified by evtType 
		 * and hdlr is to be kept, false if it is to be removed.
		 */
		EventListenerRegistrar.prototype._keepListener = function(listenersToKeep, evtType, hdlr) {
			var keep = false;

			for(var k = 0; k < listenersToKeep.length; k++) {
				for(var eventTypeToKeep in listenersToKeep[k]) {
					var handlerToKeep = listenersToKeep[k][eventTypeToKeep];
					if (evtType == eventTypeToKeep && hdlr == handlerToKeep) {
						keep = true;
						break;
					}
				}
				if (keep) break;
			}

			return keep;
		}

		/**
		 * Restores temporarily disabled listeners, unbinding all listeners 
		 * that were created after disabling the original listeners.
		 */
		EventListenerRegistrar.prototype.resumeListeners = function() {
			this._removeCurrentListeners();
			this._resumeListeners();
		}

		EventListenerRegistrar.prototype._removeCurrentListeners = function() {
			for(var eventType in this._eventListeners) {
				for(var i = 0; i < this._eventListeners[eventType].length; i++) {
					this.removeListener(eventType, this._eventListeners[eventType][i]);
				}
			}
		}

		EventListenerRegistrar.prototype._resumeListeners = function() {
			for(var eventType in this._suspendedEventListeners) {
				for(var i = 0; i < this._suspendedEventListeners[eventType].length; i++) {
					this.addListener(eventType, this._suspendedEventListeners[eventType][i]);
				}
			}
		}

		return (EventListenerRegistrar);
	}
);

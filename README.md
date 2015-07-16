# Firebase-cms

Basic CMS with Firebase and Angular

<a href="https://travis-ci.org/eralha/firebase-cms" target="_blank">
<img src="https://api.travis-ci.org/eralha/firebase-cms.svg?branch=master" alt="" /></a>
<a href="http://gruntjs.com/" target="_blank"><img src="https://cdn.gruntjs.com/builtwith.png" alt="" /></a>

# Demos

Front-end: <a href="https://rawgit.com/eralha/firebase-cms/master/index.html">demo</a><br />
Back-end: <a href="https://rawgit.com/eralha/firebase-cms/master/adm/index.html">demo</a>


##Development / Build

<p>You need to have Grunt and Node.js installed. Then run the command:</p>

```command
	npm install
	grunt default
```

##Testing

<p>Install an http-server run:</p>

```command
	npm install http-server -g
```

<p>Running the server:</p>

```command
	http-server
```

<p>This will create a server on http://localhost:8080/ and let you test this CMS</p>


##Setup

<p>Steps:</p>
<ul>
	<li>Create a firebase account</li>
	<li>Create a firebase app</li>
	<li>Add the following firebase rules</li>
	<li>Configure the file js/config.json with your firebase app location</li>
</ul>

<p>Firebase Rules:</p>
```command
	{
	    "rules": {
	        ".read": true,
	        "categorias": {
	          ".write": "auth.provider == 'password' && auth != null"
	        },
	        "paginas": {
	          ".write": "auth.provider == 'password' && auth != null",
	          ".indexOn": "state"
	        },
	        "imagens": {
	          "$page_id" : {
	          	".write": "auth.provider == 'password' && auth != null && root.child('paginas/'+$page_id).exists() && root.child('paginas/'+$page_id).child('state').val() == 'available'",
	            ".indexOn": ["ownerCategoria", "owner"]
	      	  }
	        }
	    }
	}
```

##Todos

<ul>
	<li>Add internationalization capabilities</li>
	<li>Remove from codebase any portuguese sentences/words</li>
	<li>Add capabilities of have dynamic fields</li>
	<li>Add a button on page edit screen to switch for "trash" view, here you can see the pages that have been "trashed" but not deleted</li>
	<li>Add page delete functionality on "trash" view</li>
</ul>
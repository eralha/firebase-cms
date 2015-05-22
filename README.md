# Firebase-cms

Basic CMS with Firebase and Angular

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

<p>After you have run 'npm install' run:</p>

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
	          ".write": "auth.provider == 'password' && auth != null",
	        },
	        "paginas": {
	          ".write": "auth.provider == 'password' && auth != null",
	          ".indexOn": "state"
	        },
	        "imagens": {
	          ".write": "auth.provider == 'password' && auth != null",
	          ".indexOn": "ownerCategoria"
	        }
	    }
	}
```
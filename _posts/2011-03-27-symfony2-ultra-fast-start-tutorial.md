---
layout: post
title: "Symfony2 ultra-fast start tutorial"
date: 2011-03-27 17:00:00 +0100
thumbnail: "2011-03-27-symfony2-ultra-fast-start-tutorial.jpg"
categories:
    - symfony
    - backend
comments: true
redirect_from: /symfony/backend/2011/03/27/symfony2-ultra-fast-start-tutorial.html
redirect_to: https://webdevjuice.com/symfony2-ultra-fast-start-tutorial/
---
_NOTE: This tutorial has been made with Ubuntu 11.04 – Natty Narwhal, it hasn’t been tested on other OSs. This is some kind of cheat sheet to help you if you forget something basic about symfony2, but you obviously must read symfony2 documentation to know what’s all this about [http://symfony.com/doc/2.0/book/index.html](http://symfony.com/doc/2.0/book/index.html)_

Source code of this tutorial can be downloaded at: [https://github.com/montes/Adictos-Symfony2-Bundle](https://github.com/montes/Adictos-Symfony2-Bundle)

UPDATED 5/23/2011: Updated for symfony2 beta2

## 1. Download

Download Symfony2 Standard Edition (at the moment of writing this, last version is BETA2): http://symfony.com/download

Extract

{%- highlight bash -%}
tar -zxvf Symfony_Standard_Vendors_2.0.0BETA2.tgz
{%- endhighlight -%}

And change permissions to make app/cache and app/logs writable, for example:

{%- highlight bash -%}
chmod 777 app/cache app/logs
{%- endhighlight -%}

Point your server to “web/” as root directory and you already would have to see symfony2 welcome page at http://127.0.0.1/app_dev.php/

## 2. Setup database

Setup _app/config/parameters.ini_ with your database options (you also can do it from http://127.0.0.1/app_dev.php/_configurator/ ), for mysql would be something like:

{%- highlight ini -%}
[parameters]
    database_driver=pdo_mysql
    database_host=localhost
    database_name=symfony2
    database_user=symfony2
    database_password=password
    mailer_transport=smtp
    mailer_host=localhost
    mailer_user=
    mailer_password=
    locale=en
    csrf_secret=op234j234j2424jojpfwesdcsdc
{%- endhighlight -%}

## 3. Creating our first bundle

Now we already can create a bundle:

{%- highlight bash -%}
php app/console init:bundle "Montes\AdictosBundle" src
{%- endhighlight -%}

Now add this to _app/autoload.php_ :

{%- highlight php -%}
$loader->registerNamespaces(array(
    'Montes'                         => __DIR__.'/../src',
    // ...
));
{%- endhighlight -%}

and this to _app/AppKernel.php_ :

{%- highlight php -%}
$bundles = array(
    // ...
    new Montes\AdictosBundle\MontesAdictosBundle(),
);
{%- endhighlight -%}

## 4. Route

In order to symfony2 knows where it must send requests, we add to _app/config/routing.yml_ :

{%- highlight yaml -%}
homepage:
    pattern:  /adictos
    defaults: { _controller: MontesAdictosBundle:Default:index }
{%- endhighlight -%}

At this point we already have our new bundle working at: http://127.0.0.1/app_dev.php/adictos

## 5. Controller

The default controller (_Montes/AdictosBundle/Controller/DefaultController.php_) has been already created by Symfony2, now we are going to create the _StoreController.php_

{%- highlight php -%}
//Montes/AdictosBundle/Controller/StoreController.php
<?php

namespace Montes\AdictosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class StoreController extends Controller
{
    /**
     * @Template()
     */
    public function indexAction($store)
    {
        return array('store' => $store);
    }
}
{%- endhighlight -%}

an add to _app/config/routing_dev.yml_

{%- highlight yaml -%}
store:
    pattern: /adictos/{store}
    defaults: { _controller: MontesAdictosBundle:Store:index }
{%- endhighlight -%}

and a new twig’s template at _Montes/AdictosBundle/Resources/Views/Store/index.html.twig_

{%- highlight twig -%}
So you want store "{{ store }}"?
{%- endhighlight -%}

And now going to _http://127.0.0.1/app_dev.php/adictos/my-store_ we’ll get:

So you want store “my-store”?

## 6. Model

<span style="text-decoration: line-through">First we add to app/config/config.yml “MontesAdictosBundle:</span> ~“ From Beta1 mapping is auto by default.

We start with Doctrine2, we are going to define our model for store/category. Before to start, we must to create the folder Montes/AdictosBundle/Entity where we’ll save all of them.

And we can start, model for Store:

{%- highlight php -%}
<?php
// Montes/AdictosBundle/Entity/Store.php

namespace Montes\AdictosBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Store
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
     protected $id;

    /**
     * @ORM\ManyToMany(targetEntity="Category")
     * @ORM\JoinTable(name="stores_categories",
     *      joinColumns={@ORM\JoinColumn(name="store_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="category_id", referencedColumnName="id")})
     */
    protected $categories;

    /**
     * @ORM\Column(type="string", length="255")
     */
    protected $url;

    /**
     * @ORM\Column(type="string", length="255")
     */
    protected $name;

    /**
     * @ORM\Column(type="integer")
     */
    protected $clicks = 0;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $validated = false;

    /**
     * @ORM\Column(type="integer")
     */
    protected $pcomments = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $ncomments = 0;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $active = false;

    /**
     * @ORM\Column(type="datetime", name="updated_at")
     */
    protected $updatedAt;

    /**
     * @ORM\Column(type="datetime", name="created_at")
     */
    protected $createdAt;

    public function __construct()
    {
        $this->categories = new \Doctrine\Common\Collections\ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }
}
{%- endhighlight -%}

Model for Category:

{%- highlight php -%}
<?php
// Montes/AdictosBundle/Entity/Category.php

namespace Montes\AdictosBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Category
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="Category", mappedBy="parent")
     */
    protected $children;

    /**
     * @ORM\ManyToOne(targetEntity="Category", inversedBy="children")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id")
     * @ORM\Column(nullable="true")
     */
    protected $parent;

    /**
     * @ORM\ManyToMany(targetEntity="Store", mappedBy="categories")
     */
    protected $stores;

    /**
     * @ORM\Column(type="string", length="255")
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length="255", name="url_string", unique="true")
     */
    protected $urlString;

    public function __construct()
    {
        $this->stores = new \Doctrine\Commmon\Collections\ArrayCollection();
    }
}
{%- endhighlight -%}

And now we go to terminal and run this to generate the database tables:

{%- highlight bash -%}
php app/console doctrine:schema:create
{%- endhighlight -%}

and to complete our model with its getters/setters:

{%- highlight bash -%}
php app/console doctrine:generate:entities MontesAdictosBundle
{%- endhighlight -%}

## 7. Testing the model

We’re going to change the action that shows our store to it’s own action (storeAction) and now the indexAction will show how many stores we have in the database.

{%- highlight yaml -%}
# app/config/routing_dev.yml
store:
    pattern: /adictos/{store}
    defaults: { _controller: MontesAdictosBundle:Store:store }

store_index:
    pattern: /adictos/
    defaults: { _controller: MontesAdictosBundle:Store:index }
{%- endhighlight -%}

{%- highlight php -%}
<?php
// Montes/AdictosBundle/Controller/StoreController.php

namespace Montes\AdictosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class StoreController extends Controller
{

    /**
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stores = $em->createQuery('SELECT count(s.id) AS total FROM Montes\AdictosBundle\Entity\Store s')->getSingleScalarResult();
        return array('stores' => $stores);
    }

    /**
     * @Template()
     */
    public function storeAction($store)
    {
        return array('store' => $store);
    }
}
{%- endhighlight -%}

{%- highlight twig -%}
<!-- Montes/AdictosBundle/Resources/views/Store/index.html.twig -->
We have a total of {{ stores }} stores.
{%- endhighlight -%}

{%- highlight twig -%}
<!-- Montes/AdictosBundle/Resources/views/Store/store.html.twig -->
So you want store "{{ store }}"?
{%- endhighlight -%}

Now when browsing to http://127.0.0.1/app_dev.php/adictos/ we’ll get We have a total of 0 stores and at http://127.0.0.1/app_dev.php/adictos/my-store we’ll get So you want store “_my-store_”?

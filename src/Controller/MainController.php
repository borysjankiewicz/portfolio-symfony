<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MainController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('page/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/about', name: 'about')]
    public function about(): Response
    {
        return $this->render('page/about.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/contact', name: 'contact')]
    public function contact(): Response
    {
        return $this->render('page/contact.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/privacy', name: 'privacy')]
    public function privacy(): Response
    {
        return $this->render('page/privacy.html.twig', [
        ]);
    }

    #[Route('/work/recepty-orlowo', name: 'recepty')]
    public function recepty(): Response
    {
        return $this->render('work/recepty.html.twig', []);
    }

    #[Route('/work/doskonali', name: 'doskonali')]
    public function doskonali(): Response
    {
        return $this->render('work/doskonali.html.twig', []);
    }

    #[Route('/work/autoplatform', name: 'autoplatform')]
    public function autoplatform(): Response
    {
        return $this->render('work/autoplatform.html.twig', []);
    }

    #[Route('/work/przychodnia-orlowo', name: 'orlowo')]
    public function orlowo(): Response
    {
        return $this->render('work/orlowo.html.twig', []);
    }





}

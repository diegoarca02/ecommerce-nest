import { Component } from '@angular/core';
declare var KTApp:any;
declare var KTLayoutAside:any;
declare var KTUtil:any;
declare var KTDrawer:any;
declare var KTMenu:any;
declare var KTScroll:any;
declare var KTScrolltop:any;
declare var KTToggle:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  ngOnInit(){
    setTimeout(() => {
      KTApp.init();
      KTUtil.init();
      KTDrawer.init();
      KTToggle.init();
      KTScroll.init();
      KTDrawer.updateAll();
      KTLayoutAside.init();
  
      KTScrolltop.init();

      KTMenu.init();
 

    }, 50);
  }
}

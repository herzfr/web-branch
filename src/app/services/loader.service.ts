import { Injectable, ComponentFactoryResolver, Inject, Type } from '@angular/core';
import { BannerLoadingComponent } from '../banner/banner-loading/banner-loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private factoryResolver: any;
  private rootViewContainer: any;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }


  addDynamicComponent() {
    const factory = this.factoryResolver
      .resolveComponentFactory(BannerLoadingComponent)
    const component = factory
      .create(this.rootViewContainer.parentInjector)
    this.rootViewContainer.insert(component.hostView)
  }

  // removeComponent(componentClass: Type<any>) {
  //   // Find the component
  //   const component = this.components.find((component) => component.instance instanceof componentClass);
  //   const componentIndex = this.components.indexOf(component);

  //   if (componentIndex !== -1) {
  //     // Remove component from both view and array
  //     this.container.remove(this.container.indexOf(component));
  //     this.components.splice(componentIndex, 1);
  //   }
  // }

}



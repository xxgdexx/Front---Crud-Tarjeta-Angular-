import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/Services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas:any[] = [
    // {titular: 'Wilmer Negron' , numeroTarjeta : '123456789123', fechaExpiracion : '11/12' , cvv:'123'},
    // {titular: 'Gabriel Negron' , numeroTarjeta : '123456789123', fechaExpiracion : '01/23' , cvv:'852'},
  ];
  accion = 'Agregar'
  form: FormGroup;
  id : number | undefined ;
  constructor(private fb : FormBuilder , private toastr:ToastrService , private _tarjetaService : TarjetaService) {
    this.form = this.fb.group({
      titular:['', [Validators.required,Validators.maxLength(16),Validators.minLength(5)]],
      numeroTarjeta:['', [Validators.required,Validators.maxLength(16),Validators.minLength(16)]],
      fechaExpiracion:['',[Validators.required,Validators.maxLength(5), Validators.minLength(5)]],
      cvv:['',[Validators.required,Validators.maxLength(3), Validators.minLength(3)]],

    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListarTarjetas().subscribe(data=>{
      console.log(data);
      this.listTarjetas = data;
    } , error =>{
      console.log(error);
    })
  }


  guardarTarjeta(){

    const tarjeta : any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    
    }

    if(this.id == undefined){
        //agregamos nueva tarjeta
            // this.listTarjetas.push(tarjeta)
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data=>{
        this.toastr.success('La Tarjeta fué Registrada con Exito', 'Tarjeta Registrada!');
        this.obtenerTarjetas();
        this.form.reset();
      }, error => {
        this.toastr.error('opssss ... hubo un error al enviar tarjeta',error)
        console.log(error);
      })
  
      //  console.log(tarjeta);
    } else {
      tarjeta.id = this.id;
      //Editamos Tarjeta
      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data=>{
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La Tarjeta fue actualizada con Exito!!', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      }, error=>{
        console.log(error);
      })
    }

  }

EliminarTarjeta(id : number){
// this.listTarjetas.splice(index, 1);
this._tarjetaService.deleteTarjeta(id).subscribe(data =>{

  this.toastr.error('La Tarjeta Fue eliminada con Exito','Tarjeta Eliminada');
  this.obtenerTarjetas();

}, error=>{
  console.log(error);
})
// console.log(this.toastr.error('La Tarjeta Fue eliminada con Exito','Tarjeta Eliminada'))
}

editarTarjeta(tarjeta: any){
  this.accion = "Editar";
  this.id = tarjeta.id;
  this.form.patchValue({
    titular : tarjeta.titular,
    numeroTarjeta : tarjeta.numeroTarjeta,
    fechaExpiracion : tarjeta.fechaExpiracion,
    cvv : tarjeta.cvv
  })
  console.log(tarjeta);
}

}

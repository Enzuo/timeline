#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
// use tauri::{SystemTray, SystemTrayMenu, SystemTrayMenuItem};



fn main() {
  let open = CustomMenuItem::new("open".to_string(), "Open");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let submenu = Submenu::new("File", Menu::new().add_item(open).add_item(quit));
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu);

  // let MY_APP:App
  // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  // let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  // let tray_menu = SystemTrayMenu::new()
  // .add_item(quit)
  // .add_native_item(SystemTrayMenuItem::Separator)
  // .add_item(hide);
  // let tray = SystemTray::new().with_menu(tray_menu);


  tauri::Builder::default()
    // .system_tray(tray)
    .menu(menu)
    // .setup(|app| {
    //   // MY_APP = app;
    //   Ok(())
    // })
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "quit" => {
          std::process::exit(0);
        }
        "open" => {
          let window = event.window();
          window.emit("open", Payload { message: "Tauri is awesome!".into() }).unwrap();
        }
        _ => {}
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
